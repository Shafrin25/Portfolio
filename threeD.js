const scene = document.querySelector('.slide3')
const items = document.querySelectorAll('.threeD')

scene.addEventListener('mousemove', e => {
  const rect = scene.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const rotateY = ((x / rect.width) - 0.5) * 20
  const rotateX = ((y / rect.height) - 0.5) * -20

  items.forEach(item => {
    item.style.transform +=
      ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  })
})

scene.addEventListener('mouseleave', () => {
  items.forEach(item => {
    item.style.transform =
      item.style.transform.replace(/rotateX.*rotateY.*$/, '')
  })
})
