const numerosRandom = (cant) => {
    let listado = [];
    for (let i = 0; i < cant; i++) {
        let n = (Math.random() * (1000 - 1) + 1).toFixed(0);
        let pos = listado.findIndex(elemento => elemento.num === n)
        if (pos == -1) {
            listado.push({
                num: n,
                cantidad: 1,
            })
        } else {
            listado[pos].cantidad = listado[pos].cantidad + 1;
        }
    }

    return listado;      
}

process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', function(cantidad) {
    console.log(`worker #${process.pid} iniciando su tarea`)
    const listado = numerosRandom(cantidad);
    process.send(listado)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})