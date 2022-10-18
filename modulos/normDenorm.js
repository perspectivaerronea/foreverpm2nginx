import { schema, normalize, denormalize } from 'normalizr';

//Schema para el autor
const schemaAutor = new schema.Entity('autor', {}, { idAttribute: 'email' });

const schemaDoc = new schema.Entity('_doc', { autor: schemaAutor }, { idAttribute: '_id' });

//Schema para el mensaje
const schemaMensaje = new schema.Entity('post', { _doc: schemaDoc });

//Schema para el conjunto de mensajes
const schemaMensajes = new schema.Entity('posts', { post: [schemaMensaje] });

export default function normalizarMensajes(mensajesSinNormalizar) {
    const debug = false;

    const mensajesNormalizados = normalize(mensajesSinNormalizar, schemaMensajes);

    if (debug) {
        console.log("Sin Normalizar");
        console.log(mensajesSinNormalizar);
        console.log("Normalizados");
        console.log(mensajesNormalizados);
    }

    return mensajesNormalizados;
}
