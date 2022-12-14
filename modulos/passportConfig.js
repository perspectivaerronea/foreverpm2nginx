//PASSPORT
import passport from 'passport';
import { Strategy } from 'passport-local';
import { usuariosDB } from './db.js';

class Usuario {
    constructor(u, p) {
        this.usuario = u;
        this.password = p;
    }
}

// Configuración Passport
passport.use('registro', new Strategy({ passReqToCallback: true, usernameField: 'newUser', passwordField: 'newPassword' }, async (req, username, password, done) => {

    let nuevoUsuario;

    try {
        try {
            const existeUsuario = await usuariosDB.tabla.findOne({ usuario: username })
            if (existeUsuario) {
                return done(null, false, req.flash('message', "No se puede registrar ese usuario."))
            } else {

                const user = new Usuario(username, password);
                nuevoUsuario = user;
                try {
                    nuevoUsuario.id = await usuariosDB.guardar(user);
                }
                catch (error) {
                    return done(error, false, req.flash('message', "Falló la creación del usuario."))
                }
            }
        } catch (error) {
            return done(error, false, req.flash('message', "Falló la conexión con la base de datos."))
        }

    } catch (error) {
        // todo ok
    }
    
    done(null, nuevoUsuario);
}));

passport.use('login', new Strategy({ passReqToCallback: true, usernameField: 'userLogin', passwordField: 'userPassword' }, async (req, username, password, done) => {
    let usuario;
    try {
        usuario = await usuariosDB.tabla.findOne({ usuario: username })
        if (!usuario) {
            return done(null, false, req.flash('message', "El usuario no existe."))
        } else {
            if (await usuariosDB.valida({ usuario: username, password: password })) {                
                return done(null, usuario);
            } else {
                return done(null, false, req.flash('message', "Contraseña Incorrecta."));
            }
        }
    } catch (error) {
        return done(null, false, req.flash('message', "No se pudo conectar con la DB."));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await usuariosDB.obtenerRegistrosPorID(id);
    done(null, user)
});

export default passport;