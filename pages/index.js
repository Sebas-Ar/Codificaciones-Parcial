import React, { useState, useEffect } from 'react'
import { Decimal } from 'decimal.js';
import { Element, scroller } from 'react-scroll';
import Head from 'next/head'
import Footer from '../components/Footer'
import Swal from 'sweetalert2'

const setupScroll = {
    duration: 3000,
    delay: 50,
    smooth: true, // linear “easeInQuint” “easeOutCubic”,
    offset: -10
}

const Home = () => {

    const [numSimbolos, setNumSimbolos] = useState(6);
    const [mensaje, setMensaje] = useState([
        /* {i: 0, simbolo: 'a'},
        {i: 1, simbolo: 'b'},
        {i: 2, simbolo: 'c'},
        {i: 3, simbolo: 'd'},
        {i: 4, simbolo: 'e'},
        {i: 5, simbolo: 'f'},
        {i: 6, simbolo: 'a'},
        {i: 7, simbolo: 'b'},
        {i: 8, simbolo: 'c'}, */
    ])
    const [nummensaje, setNumMensaje] = useState(0);
    const [simbolos, setSimbolos] = useState([
        /* { i: 0, probabilidad: 0.2, simbolo: "a" },
        { i: 1, probabilidad: 0.1, simbolo: "b" },
        { i: 2, probabilidad: 0.2, simbolo: "c" },
        { i: 3, probabilidad: 0.1, simbolo: "d" },
        { i: 4, probabilidad: 0.1, simbolo: "e" },
        { i: 5, probabilidad: 0.3, simbolo: "f" }, */
    ]);
    const [validateFirst, setValidateFirst] = useState(false)
    const [validateSecond, setValidateSecond] = useState(false);
    const [validateThird, setValidateThird] = useState(false);
    const [validateFour, setValidateFour] = useState(false);
    const [value, setValue] = useState([]);
    const [decodificacion, setDecodificacion] = useState([]);
    const [binarioEq, setBinarioEq] = useState('');
    const [matriz, setMatriz] = useState([
        [ 1, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [10, 10, 10, 10, 10,  2,  2,  2,  2,  2],
        [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
        [ 2,  2,  2,  2,  2,  5,  5,  5,  5,  5],
        [ 5,  5,  5,  5,  5, 10, 10, 10, 10, 10],
        [10, 10, 10, 10, 10, 10, 13, 13, 13, 13],
        [13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
        [13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
        [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
        [ 2,  2,  2,  2,  2,  5,  5,  5,  5,  5],
    ]);
    const [fr, setFr] = useState('');
    const [largo, setLargo] = useState(0);
    const [tasaTrama, setTasaTrama] = useState([]);
    const [masEficiente, setMasEficiente] = useState(false);
    const [comparacion, setComparacion] = useState([]);

    const [zigzag, setZigzag] = useState([]);

    useEffect(() => {
        scroller.scrollTo("info2", setupScroll)
    }, [value]);

    useEffect(() => {
        let vector = []
        for (let i = 0; i < numSimbolos; i++) {
            if (simbolos[i]) {
                vector[i] = {
                    i,
                    simbolo: simbolos[i].simbolo ? simbolos[i].simbolo : undefined,
                    probabilidad: simbolos[i].probabilidad ? simbolos[i].probabilidad : 0
                }
            } else {
                vector[i] = { i }
            }
        }
        setSimbolos(vector)
    }, [])

    useEffect(() => {
        let msg = []

        for (let i = 0; i < nummensaje; i++) {
            if (mensaje[i]) {
                msg[i] = {
                    i,
                    simbolo: mensaje[i].simbolo ? mensaje[i].simbolo : undefined
                }
            } else {
                msg[i] = { i }
            }
        }

        setMensaje(msg)

    }, [nummensaje])

    useEffect(() => {

        let sumaSimbolos = 0
        let sumaProbabilida = 0

        for (let sim of simbolos) {

            sim.simbolo ? sumaSimbolos += 1 : null
            sim.probabilidad ? sumaSimbolos += 1 : null
            sumaProbabilida += sim.probabilidad

        }

        if (sumaSimbolos / numSimbolos === 2) {
            if (sumaProbabilida === 1) {
                setValidateFirst(true)
                
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'La sumatoria de probabilidades debe ser igual a 1',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        } else {
            setValidateFirst(false)
        }

    }, [simbolos])

    useEffect(() => {

        let sumaSimbolos = 0
        let validate = true
        let validateNull = true

        for (const msg of mensaje) {
            msg.simbolo ? sumaSimbolos += 1 : null
        }

        for (const sim of simbolos) {
            let suma = 0
            for (const msg of mensaje) {
                if (msg.simbolo !== 'nulo') {
                    sim.simbolo === msg.simbolo ? suma += 1 : null
                } else {
                    validate = false
                    validateNull = false
                }
            }
            if (suma === 0) {
                validate = false
            }
        }

        if (sumaSimbolos === nummensaje && nummensaje !== 0) {
            if (validate) {
                setValidateSecond(true)
                scroller.scrollTo("info2", setupScroll)
            } else {
                if (validateNull) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'El mensaje debe contener todos los simbolos',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    setValidateSecond(false)
                } else {
                    setValidateSecond(false)
                }
            }
        }

    }, [mensaje]);

    const onChangeNumMensaje = (e) => {
        let sumaProbabilidades = 0
        let simbolosAB = []
        for (let i = 0; i < simbolos.length; i++) {
            simbolosAB[i] = simbolos[i];
        }

        for (const sim of simbolosAB) {
            sim.a = sumaProbabilidades
            sim.b = sim.probabilidad + sumaProbabilidades
            sumaProbabilidades += sim.probabilidad
        }

        if (parseInt(e.target.value) < 0) {
            setNumMensaje(parseInt(0))
            e.target.value = 0
        } else {
            setNumMensaje(parseInt(e.target.value))
        }

    }

    const onChangeMensaje = (e, pos) => {

        let msg = []
        for (let i = 0; i < mensaje.length; i++) {
            msg[i] = mensaje[i];
        }
        msg[pos] = Object.assign({}, msg[pos], { [e.target.name]: e.target.value })
        setMensaje(msg)

    }

    const onChangeSimbol = (e, sim) => {

        let arreglo = []
        for (let i = 0; i < simbolos.length; i++) {
            arreglo[i] = simbolos[i];
        }

        if (e.target.value.length < 2) {
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: e.target.value })
            for (let simbol1 of arreglo) {
                let suma = 0
                for (let simbol2 of arreglo) {
                    if (simbol1.simbolo !== undefined && simbol2.simbolo !== undefined) {
                        if (simbol1.simbolo === simbol2.simbolo) suma += 1
                    }
                }
                if (suma > 1) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'el simbolo ya existe',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: null })
                    e.target.value = ''
                }
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'Solo puedes ingresar un simbolo',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: null })
            e.target.value = ''
        }
        setSimbolos(arreglo)
    }

    const onChangeProbabilidad = (e, sim) => {

        let arreglo = []
        for (let i = 0; i < simbolos.length; i++) {
            arreglo[i] = simbolos[i];
        }

        let suma = 0
        let value = parseFloat(e.target.value)

        if (isNaN(value)) {
            
            value = '0.';
        }

        if (value >= 0) {

            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: value })

        } else {

            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'No puedes ingresar numeros negativos',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: '' })
            e.target.value = ''

        }


        for (let simbol1 of arreglo) {
            if (simbol1.probabilidad) {
                suma += simbol1.probabilidad
            }
        }

        if (suma > 1) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'La suma de las probabilidades no puede ser mayor a 1',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: null })
            e.target.value = null
        }

        setSimbolos(arreglo)
    }

    const codificar = () => {

        let a = 0
        let b = 1
        let newA = 0
        let newMensage = []

        for (let i = 0; i < mensaje.length; i++) {
            newMensage[i] = mensaje[i];

        }

        for (const msg of newMensage) {
            for (const sim of simbolos) {
                if (msg.simbolo === sim.simbolo) {
                    msg.a = sim.a
                    msg.b = sim.b
                }
            }
        }

        setMensaje(newMensage)

        for (const msg of mensaje) {
            newA = a
            a = a + ((b - a) * msg.a)
            b = newA + ((b - newA) * msg.b)
            newA = a
        }

        console.log(a)
        a += ''

        a = a.split('')
        console.log('el tamaño es -> ' + a.length)
        if (a[a.length - 2] === '0' && a[a.length - 3] === '0' && a[a.length - 4] === '0') {
            a[a.length - 1] = '0'
        }
        
        let suma = '0.'
        console.log(a[a.length - 2] + ' - ' + a[a.length - 3] + ' - ' + a[a.length - 4])
        if (a[a.length - 2] === '9' && a[a.length - 3] === '9' && a[a.length - 4] === '9') {
            for (let i = 2; i < a.length; i++) {
                if (i === a.length - 1) {
                    suma += '4'
                } else {
                    suma += '0'
                }
            }

            console.log(suma)
            suma = parseFloat(suma)
            a = a.join('')
            a = parseFloat(a)

            console.log(suma + ' + ' + a)

            a = a + suma

            a += ''
            a = a.split('')
            console.log('el tamaño es -> ' + a.length)
            if (a[a.length - 2] === '0' && a[a.length - 3] === '0' && a[a.length - 4] === '0') {
                a[a.length - 1] = '0'
            }
            a = a.join('')
            a = parseFloat(a)

        } else {
            a = a.join('')
            a = parseFloat(a)
        }

        setValue([a, b.toFixed(7)])

        console.log(a)

        let cont = 0
        let binario = '0.'
        let binario2Decimal = 0
        let decimal = a
        let verificacion = 0
        
        a = a + ''

        while (cont < 100) {
            binario += Math.trunc(decimal * 2)

            if (decimal * 2 >= 1) {
                console.log('-------------------------------------------------------')
                decimal = (decimal * 2) - 1

                for (let i = 2; i < binario.length; i++) {
                    binario2Decimal += binario[i] * Math.pow(2, (-i + 1))
                }

                if (binario2Decimal === a) {
                    cont = 100
                }

                let str = binario2Decimal + ''

                for (let i = 0; i < a.length; i++) {
                    if (a[i] === str[i]) {
                        verificacion++
                    }
                }

                let final = parseInt(a[a.length - 1])
                console.log(final)

                if (verificacion === a.length - 1) {
                    console.log(str[a.length - 1] + ' >= ' + (final - 1))
                    console.log(str[a.length - 1])
                    console.log((final - 1))
                    if (parseInt(str[a.length - 1]) === (final - 1)) {
                        console.log(str[a.length])
                        if (str[a.length] >= 5) {
                            cont = 100
                        }
                    }
                }

                console.log('deciaml -> ' + binario2Decimal)
                console.log('bianrio ->' + binario)
            } else {
                decimal = decimal * 2
            }
    
            verificacion = 0
            binario2Decimal = 0
            cont++
        }

        setBinarioEq(binario)
        console.log(binario)

    }

    const handleMatriz = () => {

        let trama = []

        for (let i = 2; i < binarioEq.length; i++) {
            trama[i - 2] = binarioEq[i]
        }

        console.log(trama.length)

        let cuenta = 0
        let cuadrado = 0

        while (cuadrado < trama.length) {
            cuenta++
            cuadrado = cuenta * cuenta
        }

        while (trama.length < cuadrado) {
            trama.push('0')
        }

        setZigzag(trama)


        console.log(trama)
        setLargo(cuenta)

        let M = []


        for (let i = 0; i < cuenta; i++) {
            M[i] = new Array(cuenta)
        }

        console.log(M)
        console.log('----------------------')

        let filas =  ''
        for (let i = 0; i < cuenta; i++) {
            filas += '1fr '
        }
        
        setFr(filas)
        
        let cont = 0

        let x = 0
        let y = 0

        let lateral = false
        let vertical = false

        let mitad = false

        let secuencia = []

        console.log(M)
        
        while (cont < cuadrado) {
            console.log(trama[cont] + ' -> ' + '[' + x + ',' + y + ']')
            if (!(vertical && y === 0) && !(vertical && x === cuenta - 1)) {
                M[y][x] = trama[cont]
                console.log(M[y][x])
                console.log(M)
            }

            if (y === cuenta - 1) {
                mitad = true
            }

            if (mitad) {
                if (vertical) {
                    if (x === cuenta - 1) {
                        vertical = false
                        lateral = false
                        cont--
                    } else {
                        y--
                        x++
                    }
                } else {
                    if (lateral) {
                        if (y === cuenta - 1) {
                            x++
                            vertical = true
                        } else {
                            y++
                            x--
                        }
                    } else {
                        if (x === cuenta - 1) {
                            y++
                            lateral = true
                        }

                    }
                }
            } else {
                if (vertical) {
                    if (y === 0) {
                        vertical = false
                        lateral = false
                        cont--
                    } else {
                        y--
                        x++
                    }
                } else {
                    if (lateral) {
                        if (x === 0) {
                            y++
                            vertical = true
                        } else {
                            y++
                            x--
                        }
                    } else {
                        if (y === 0) {
                            x++
                            lateral = true
                        }

                    }
                }
            }

            cont++
        }

        setMatriz(M)

        setValidateThird(true)

    }

    const read = (cuenta,bool = false) => {
        let secuencia = []

        for (let y = 0; y < cuenta; y++) {
            for (let x = 0; x < cuenta; x++) {
                if (bool) {
                    secuencia.push(matriz[y][x])//lateral
                } else {
                    secuencia.push(matriz[x][y])//vertical
                }
            }
        }

        return secuencia
    }

    const calcularTasa = (data) => {

        let cont = 0
        let repeticiones = []

        let carater = 0

        for (let i = 0; i < data.length; i++) {
            //data[i]
            if (data[i] === data[i + 1]) {
                carater = data[i]
                cont++
            } else {
                carater = data[i]
                cont++
                repeticiones.push([carater, cont, i])
                cont = 0
            }
        }


        let cuentaCaracter = 0
        let cuentaRepeticion = 0

        for (let i = 0; i < repeticiones.length; i++) {
            if (repeticiones[i][0] > cuentaCaracter) {
                cuentaCaracter = repeticiones[i][0]
            }
            if (repeticiones[i][1] > cuentaRepeticion) {
                cuentaRepeticion = repeticiones[i][1]
            }
        }

        let binarioCaracter = ''

        while (cuentaCaracter > 0) {
            if (cuentaCaracter % 2 == 0) {
                binarioCaracter += 0
            } else {
                binarioCaracter += 1
            }
            cuentaCaracter = Math.floor(cuentaCaracter / 2)
        }

        let binarioRepeticion = ''

        while (cuentaRepeticion > 0) {
            if (cuentaRepeticion % 2 == 0) {
                binarioRepeticion += 0
            } else {
                binarioRepeticion += 1
            }
            cuentaRepeticion = Math.floor(cuentaRepeticion / 2)
        }

        console.log([binarioCaracter.length, binarioRepeticion.length])

        let binarios = []

        for (let i = 0; i < repeticiones.length; i++) {

            let carc = repeticiones[i][0]
            let rep = repeticiones[i][1]

            let binCaracter = ''

            while (carc > 0) {
                if (carc % 2 == 0) {
                    binCaracter += 0
                } else {
                    binCaracter += 1
                }
                carc = Math.floor(carc / 2)
            }
            while (binCaracter.length < binarioCaracter.length) {
                binCaracter += '0'
            }

            let binRepeticiones = ''

            while (rep > 0) {
                if (rep % 2 == 0) {
                    binRepeticiones += 0
                } else {
                    binRepeticiones += 1
                }
                rep = Math.floor(rep / 2)
            }
            while (binRepeticiones.length < binarioRepeticion.length) {
                binRepeticiones += '0'
            }

            binarios[i] = [
                binCaracter.split('').reverse().join(''),
                binRepeticiones.split('').reverse().join(''),
                (i + 1) * 100
            ]

        }

        let tramaCompleta = ''

        for (let i = 0; i < binarios.length; i++) {
            tramaCompleta += binarios[i][0] + binarios[i][1]
        }

        console.log(tramaCompleta)

        let tasa = 0

        console.log(data.length + ' - ' + tramaCompleta.length + ' / ' + data.length)
        tasa = (data.length - tramaCompleta.length) / data.length

        return [tasa * 100, tramaCompleta]

    }

    const handleLectura = () => {

        let secuenciaLateral = []
        let secuenciaVertical = []

        secuenciaLateral = read(largo, true)
        secuenciaVertical = read(largo, false)


        let [tasaLateral, tramaLateral] = calcularTasa(secuenciaLateral)
        let [tasaVertical, tramaVertical] = calcularTasa(secuenciaVertical)
        let [tasaZigZag, tramaZigZag] = calcularTasa(zigzag)



        console.log('------------------')
        console.log(zigzag)
        console.log('taza -> ' + tasaZigZag)
        console.log('trama -> ' + tramaZigZag)


        console.log(secuenciaLateral)
        console.log('% -> ' + tasaLateral)
        console.log(secuenciaVertical)
        console.log('% -> ' + tasaVertical)

        if (tasaLateral > tasaVertical) {
            setTasaTrama([tasaLateral, tramaLateral])
            setMasEficiente(true)
        } else {
            setTasaTrama([tasaVertical, tramaVertical])
            setMasEficiente(false)
        }

        setComparacion([tasaLateral, tasaVertical, tasaZigZag])


        setValidateFour(true)
    }

    return (
        <div className="container">

            <Head>
                <title>Parcial</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>PARCIAL 2° CORTE</h1>

            <div className="content">

                <main>
                    {/* <label className="completo">
                        <p className="weight">Ingrese el número de simbolos a utilizar:</p>
                        <input type="number" name="numSimbolos" value={numSimbolos} onChange={onChange} />
                    </label> */}
                    <div style={{gridColumn: '1/3'}}>
                        <p className="weight">Asignación de simbolos y probabilidades</p>
                        <p style={{fontSize: '12px', textAlign: 'center'}}>Los decimales deben ser ingresador con 'comas' ( , )</p>
                        {
                            
                            simbolos.map(simbolo => (
                                <label key={simbolo.i} className="completo">
                                    <p className="simbol">Escriba el simbolo {simbolo.i + 1} y su probabilidad:</p>
                                    <div>
                                        <input
                                            className="simbolInput"
                                            type="text"
                                            name="simbolo"
                                            onChange={(e) => { onChangeSimbol(e, simbolo.i) }}
                                            value={simbolo.simbolo}
                                        />
                                        <span>→</span>
                                        <input
                                            className="simbolInputP"
                                            type="number"
                                            name="probabilidad"
                                            onChange={(e) => { onChangeProbabilidad(e, simbolo.i) }}
                                            value={simbolo.probabilidad}
                                        />
                                    </div>
                                </label>
                            ))

                        }
                    </div>
                </main>

                {
                    validateFirst
                        ?
                        <main>
                            <label className="completo">
                                <p className="weight">Ingrese cuantos simbolos va a usar en el mensaje</p>
                                <select name="numSimbolos" onChange={onChangeNumMensaje}>
                                    <option value="nulo">-</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </label>

                            {
                                mensaje.map(msg => (
                                    <label key={msg.i}>
                                        <p className="simbol">Elija el simbolo {msg.i + 1}</p>
                                        <select defaultValue="nulo" name="simbolo" onChange={(e) => { onChangeMensaje(e, msg.i) }}>
                                            <option value="nulo">-</option>
                                            {
                                                simbolos.map(sim => (
                                                    <option key={sim.i} value={sim.simbolo}>{sim.simbolo}</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                ))
                            }
                        </main>
                        :
                        null
                }

                {
                    validateFirst && validateSecond
                        ?
                        <main className="completo" name="info2">
                            <p className="weight completo">Distribución de probabilidades</p>
                            <div className="completo top">
                                {
                                    simbolos.map(sim => (
                                        <span><span className="weight">{sim.simbolo}</span>→ [{sim.a || sim.a === 0 ? sim.a.toFixed(2) : ''},{sim.b ? sim.b.toFixed(2) : ''})</span>
                                    ))
                                }
                            </div>
                            <br />
                            <p className="weight completo">Gráfica de la distribución</p>
                            <div className="grafica completo">
                                <div className="linea">
                                    {
                                        simbolos.map(sim => (
                                            <span className="numero" style={{ left: `${sim.a * 600}px`, margin: '0' }}>{sim.a.toFixed(2)}</span>
                                        ))
                                    }
                                    {
                                        simbolos.map(sim => (
                                            <div className="punto" style={{ left: `${sim.a * 600}px` }}></div>
                                        ))
                                    }
                                    {
                                        simbolos.map(sim => (
                                            <span className="letra weight" style={{ left: `${sim.b * 300 + sim.a * 300}px`, margin: '0' }}>{sim.simbolo}</span>
                                        ))
                                    }
                                    <div className="punto" style={{ left: '600px' }}></div>
                                    <span className="numero" style={{ left: '600px', margin: '0' }}>1</span>
                                </div>
                            </div>
                            <br />
                            <button className="completo" onClick={codificar}>Codificar</button>

                        </main>
                        :
                        null

                }

                {
                    value[0] && value[1] && validateFirst && validateSecond
                        ?
                        <main>
                            <div className="completo centrado dot">
                                <p className="completo weight">El valor a codificar es:</p>
                                <p className="completo centrado">Decimal:</p>
                                <p className="completo size">{value[0]}</p>
                                <p className="completo centrado">Binario:</p>
                                <p className="completo size">{binarioEq}</p>
                                <button className="completo" onClick={handleMatriz}>Generar Matriz</button>
                            </div>
                        </main>
                        :
                        null
                }

                {
                    validateThird && value[0] && value[1] && validateFirst && validateSecond
                        ?
                        <main>
                            <div className="completo centrado">
                                <p className="completo weight">La Matriz es:</p>
                                <div className="matriz completo">
                                    {
                                        matriz.map(m => (
                                            <>
                                                {m.map( ma => (
                                                    <span>{ma}</span>
                                                ))}
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                            <button className="completo" onClick={handleLectura}>Leer Matriz</button>
                        </main>
                        :
                        null
                }

                {
                    validateFour && validateThird && value[0] && value[1] && validateFirst && validateSecond
                    ?
                    <main className="completo">
                        <div className="completo centrado">
                            <p className="weight">Comparación tasa de compresión</p>
                        </div>
                        <div className="centrado">
                            <p>Tasa Horizontal</p>
                            <p style={{fontSize: '20px', margin: '0'}}>{comparacion[0].toFixed(1)}%</p>
                        </div>
                        <div className="centrado">
                            <p>Tasa Vertical</p>
                            <p style={{ fontSize: '20px', margin: '0' }}>{comparacion[1].toFixed(1)}%</p>
                        </div>
                        <div className="completo">
                            <p>Tasa Zig-Zag</p>
                            <p style={{ fontSize: '20px', margin: '0' }}>{comparacion[2].toFixed(1)}%</p>
                        </div>
                    </main>
                    :
                    ''

                }

                {
                    validateFour && validateThird && value[0] && value[1] && validateFirst && validateSecond
                    ?
                    <main className="completo">
                        <div className="completo centrado">
                            <p className="weight">La lectura {masEficiente ? 'Horizontal' : 'Vertical'} es más eficiente</p>
                            <p>Trama resultante:</p>
                            <p>{tasaTrama[1]}</p>

                        </div>
                    </main>
                    :
                    ''

                }

            </div>

            <Footer />

            <style jsx>{`

                .dot > p {
                    margin: 10px 0;
                }

                .matriz {
                    display: grid;
                    grid-template-columns: ${fr};
                }

                .matriz > span {
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    width: 30px;
                    height: 30px;
                    padding: 0;
                    border: 1px dashed white;
                    text-align: center;
                    margin: 0;
                }

                .grafica {
                    margin-top: 32px;
                }

                .letra {
                    position: absolute;
                    top: -20px;
                    transform: translateX(-50%);
                }

                .top {
                    margin-top: 16px;
                }

                .numero {
                    font-size: 12px;
                    position: absolute;
                    top: -35px;
                    transform: translateX(-45%);
                }

                .linea {
                    width: 600px;
                    height: 3px;
                    background: white;
                    position: relative;
                }

                .punto {
                    position: absolute;
                    top: -10px;
                    width: 3px;
                    height: 23px;
                    background: white;
                }

                h1 {
                    color: white;
                    text-align: center;
                }

                .simbol {
                    font-size: 12px;
                }

                .weight {
                    font-weight: 600;
                }

                .size {
                    font-size: 25px;
                }

                .content {
                    display: grid; 
                    grid-template-columns: ${validateFirst ? '1fr 1fr' : '1fr'};
                }

                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                span {
                    color: white;
                    margin: 0 5px;
                }

                label {
                    display: grid;
                    justify-items: center;
                }

                input, select {
                    height: 30px;
                    border-radius: 20px;
                    border: 1px solid #33333344;
                    padding: 10px;
                    outline: none;
                    text-align: center;
                }

                select {
                    padding: 0px 10px;
                }

                .simbolInput {
                    width: 50px;
                    margin: 0 5px;
                }

                .simbolInputP {
                    width: 70px;
                    margin: 0 5px;
                }

                .completo {
                    grid-column: 1/3
                }

                .centrado {
                    display: grid;
                    justify-items: center;
                }

                .completo2 {
                    grid-column: 1/4
                }

                .final {
                    display: grid;
                    grid-template-columns: 1fr 30px 1fr 30px .5fr;
                    align-items: center;
                    justify-items: center;
                }

                main {
                    padding: 5rem 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    justify-items: center;
                    border-radius: 30px;
                    margin: 10px;
                    padding: 30px;
                    background: #2C3E5044;
                }

                :globla(body) {
                    background: linear-gradient(180deg, #F3904F 0%, #3B4371 100%);
                }

                p {
                    color: white;
                }

                button {
                    border: none;
                    padding: 10px 30px;
                    border-radius: 30px;
                    background-color: #528B90;
                    color: white;
                    cursor: pointer;
                    transition: background-color 1s;
                    outline: none;
                    margin: 16px 0;
                }

                button:hover {
                    background-color: #51A8A7;
                }

            `}</style>

            <style jsx global>{`

                html, body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

            `}</style>

        </div>
    )
}

export default Home