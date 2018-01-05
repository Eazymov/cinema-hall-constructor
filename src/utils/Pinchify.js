function Pinchify (element) {
  const mc = new Hammer.Manager(element)
  const pan = new Hammer.Pan({ threshold: 0, pointers: 0 })
  const pinch = new Hammer.Pinch({ threshold: 0 })

  mc.add(pan)
  mc.add(pinch).recognizeWith([mc.get('pan')])
  
  mc.on("panstart panmove", onPan);
  mc.on("pinchstart pinchmove", onPinch)

  let initScale = 1
  let scale = 1
  let initX = 0
  let initY = 0
  const translate = {
    x: initX,
    y: initY,
  }

  function onPan(event) {
    if (event.type === 'panstart') {
      initX = translate.x
      initY = translate.y
    }

    translate.x = initX + event.deltaX
    translate.y = initY + event.deltaY

    updateElement()
  }

  function onPinch(event) {
    if (event.type === 'pinchstart') {
      initScale = scale || 1
    }

    scale = initScale * event.scale

    updateElement()
  }
  
  function updateElement () {
    const { x, y } = translate
    const transformStyle = `translate(${x}px, ${y}px) scale(${scale})`

    element.style.transform = transformStyle
  }
}

export default Pinchify
