export async function letItSnow(options) {
  const TO_RADIANS = Math.PI / 180
  const THREE_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.min.js'
  const particles = []
  let camera = null
  let scene = null
  let renderer = null

  function load(src) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script')
      script.src = src
      script.addEventListener('load', () => resolve(script), false)
      script.addEventListener('error', () => reject(), false)
      document.body.appendChild(script)
    })
  }

  function setup() {
    class Particle3D extends THREE.Sprite {
      constructor(material) {
        super(material)
        this.velocity = new THREE.Vector3(0, -8, 0)
        this.velocity.rotateX(randomRange(-45, 45))
        this.velocity.rotateY(randomRange(0, 360))
        this.gravity = new THREE.Vector3(0, 0, 0)
        this.drag = 1
      }

      updatePhysics() {

        this.velocity.add(this.gravity)
        this.position.add(this.velocity)
      }

    }

    THREE.Vector3.prototype.rotateY = function(angle) {
      const cosRY = Math.cos(angle * TO_RADIANS)
      const sinRY = Math.sin(angle * TO_RADIANS)

      const tempz = this.z
      const tempx = this.x

      this.x = (tempx * cosRY) + (tempz * sinRY)
      this.z = (tempx * -sinRY) + (tempz * cosRY)
    }

    THREE.Vector3.prototype.rotateX = function(angle) {
      const cosRY = Math.cos(angle * TO_RADIANS)
      const sinRY = Math.sin(angle * TO_RADIANS)

      const tempz = this.z
      const tempy = this.y

      this.y = (tempy * cosRY) + (tempz * sinRY)
      this.z = (tempy * -sinRY) + (tempz * cosRY)
    }

    THREE.Vector3.prototype.rotateZ = function(angle) {
      const cosRY = Math.cos(angle * TO_RADIANS)
      const sinRY = Math.sin(angle * TO_RADIANS)

      const tempx = this.x
      const tempy = this.y

      this.y = (tempy * cosRY) + (tempx * sinRY)
      this.x = (tempy * -sinRY) + (tempx * cosRY)
    }
    return Particle3D
  }


  function randomRange(min, max) {
    return ((Math.random() * (max - min)) + min)
  }

  function loop() {
    for(var i = 0; i < particles.length; i++) {
      var particle = particles[i]
      particle.updatePhysics()
      const {x, y, z} = particle.position
      const pos = particle.position

      if(y < -1000) pos.y += 2000
      if(x > 1000) pos.x -= 2000
      else if(x < -1000) pos.x += 2000
      if(z > 1000) pos.z -= 2000
      else if(z < -1000) pos.z += 2000

    }

    camera.position.x += (camera.position.x) * 0.05
    camera.position.y += (camera.position.y) * 0.05
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
    requestAnimationFrame(loop)
  }

  const SCREEN_WIDTH = window.innerWidth
  const SCREEN_HEIGHT = window.innerHeight
  let Particle3D = null

  if(!window.THREE) {
    await load(THREE_JS_URL)
    Particle3D = setup()
  }
  camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000)
  camera.position.z = 1000

  scene = new THREE.Scene()
  scene.add(camera)

  renderer = new THREE.WebGLRenderer(options.renderer)
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

  const img = new Image()
  img.src = options.particleImage
  const texture = new THREE.TextureLoader().load(options.particleImage)

  var material = new THREE.SpriteMaterial({
    map: texture,
  })

  for (var i = 0; i < (options.particles || 200); i++) {
    const particle = new Particle3D(material)
    particle.position.x = Math.random() * 2000 - 1000
    particle.position.y = Math.random() * 2000 - 1000
    particle.position.z = Math.random() * 2000 - 1000
    particle.scale.x = particle.scale.y = 10
    scene.add(particle)
    particles.push(particle)
  }

  /*document.addEventListener('mousemove', onDocumentMouseMove, false );
  document.addEventListener('touchstart', onDocumentTouchStart, false );
  document.addEventListener('touchmove', onDocumentTouchMove, false );*/

  requestAnimationFrame(loop)
}
