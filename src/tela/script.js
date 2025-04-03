document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#game-canvas')
  const container = canvas.parentElement
  const ctx = canvas.getContext('2d')

  let isDragging = false
  let startX, startY, scrollLeft, scrollTop

  // Desenha uma referência no centro do canvas
  function drawReference() {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Quadrado vermelho
    ctx.fillStyle = 'red'
    ctx.fillRect(centerX - 10, centerY - 10, 20, 20)

    // Círculo azul
    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Linhas cruzadas (Eixo X e Y)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 100, centerY)
    ctx.lineTo(centerX + 100, centerY)
    ctx.moveTo(centerX, centerY - 100)
    ctx.lineTo(centerX, centerY + 100)
    ctx.stroke()
  }

  drawReference()

  // Movimentação do canvas (arrastar)
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.pageX - canvas.offsetLeft
    startY = e.pageY - canvas.offsetTop
    scrollLeft = container.scrollLeft
    scrollTop = container.scrollTop
    canvas.style.cursor = 'grabbing'
  })

  canvas.addEventListener('mouseleave', () => {
    isDragging = false
    canvas.style.cursor = 'grab'
  })

  canvas.addEventListener('mouseup', () => {
    isDragging = false
    canvas.style.cursor = 'grab'
  })

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - canvas.offsetLeft
    const y = e.pageY - canvas.offsetTop
    const walkX = (x - startX) * -1
    const walkY = (y - startY) * -1
    container.scrollLeft = scrollLeft + walkX
    container.scrollTop = scrollTop + walkY
  })
})
document.addEventListener('DOMContentLoaded', () => {
  const btnAdicionar = document.querySelector('.adicionar')
  const listaTreinadores = document.querySelector('.treinadores-lista')

  let contadorTreinadores = 0
  const maxTreinadores = 5 // Limite máximo de treinadores

  btnAdicionar.addEventListener('click', () => {
    if (contadorTreinadores >= maxTreinadores) {
      // eslint-disable-next-line no-undef
      alert('Limite máximo de 5 treinadores atingido!')
      return
    }

    contadorTreinadores++

    const treinador = document.createElement('div')
    treinador.classList.add('treinador')

    treinador.innerHTML = `
          <div class="treinador-header">
              <p>Treinador ${contadorTreinadores}</p>
              <button class="btn remover">Remover</button>
          </div>
          <div class="treinador-config">
              <label>Velocidade: <input type="number" value="1" min="1" max="5"></label>
              <label>Resistência: <input type="number" value="5" min="5" max="15"></label>
              <label>Campo de visão: <input type="number" value="10" min="10" max="50"></label>

              <div class="checkbox-group">
                  <p>Estratégia:</p>
                  <label>
                      <input type="radio" name="estrategia-${contadorTreinadores}" value="agressivo" checked>
                      Agressivo
                  </label>
                  <label>
                      <input type="radio" name="estrategia-${contadorTreinadores}" value="cauteloso">
                      Cauteloso
                  </label>
              </div>

              <div class="checkbox-group">
                  <p>Pokémon:</p>
                  <label>
                      <input type="radio" name="pokemon-${contadorTreinadores}" value="bulbasaur" checked>
                      Bulbasaur
                  </label>
                  <label>
                      <input type="radio" name="pokemon-${contadorTreinadores}" value="charmander">
                      Charmander
                  </label>
                  <label>
                      <input type="radio" name="pokemon-${contadorTreinadores}" value="squirtle">
                      Squirtle
                  </label>
              </div>
          </div>
      `

    listaTreinadores.appendChild(treinador)

    // Adicionar evento ao botão de remover dentro do novo treinador
    treinador.querySelector('.remover').addEventListener('click', () => {
      treinador.remove()
      contadorTreinadores-- // Atualiza o contador ao remover
    })
  })
})
