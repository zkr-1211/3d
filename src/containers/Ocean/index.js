import '@/containers/Ocean/index.styl'
import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Water } from 'three/examples/jsm/objects/Water'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import islandModel from '@/containers/Ocean/models/island.glb'
import issum_the_town_on_capital_isle from '@/containers/Ocean/models/issum_the_town_on_capital_isle.glb'
import flamingoModel from '@/containers/Ocean/models/flamingo.glb'
import fh from '@/containers/Ocean/models/fh.glb'
import primoGroudon from '@/containers/Ocean/models/primo_groudon.glb'
import kyogrePrimal from '@/containers/Ocean/models/kyogre_primal.glb'
import rayquazaRemastered from '@/containers/Ocean/models/rayquaza_remastered.glb'
import zapdosGalarian from '@/containers/Ocean/models/zapdos_galarian.glb'
import Animations from '@/assets/utils/animations'
import vertexShader from '@/containers/Ocean/shaders/rainbow/vertex.glsl'
import fragmentShader from '@/containers/Ocean/shaders/rainbow/fragment.glsl'
import Stats from 'three/examples/jsm/libs/stats.module'
import { initWater } from './map/water'
import { initSky } from './map/sky'
import { initSun } from './map/sun'
import { initLight} from './map/light'
export default function Earth() {
  const [loadingProcess, setLoadingProcess] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const mixers = []

  useEffect(() => {
    initThree()
    return () => {
      // 在组件卸载时清除副作用
    }
  }, [])

  const initThree = () => {
    // 创建一个新的 THREE.Clock 对象
    const clock = new THREE.Clock()

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // 创建渲染器，并设置canvas和抗锯齿
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    })
    // 设置渲染器的像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置渲染器的尺寸
    renderer.setSize(sizes.width, sizes.height)
    // 设置 toneMapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    // 创建场景
    const scene = new THREE.Scene()
    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 20000)
    // 设置相机的位置
    camera.position.set(0, 600, 1600)

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器的目标位置
    controls.target.set(0, 0, 0)
    // 设置控制器的 damping
    controls.enableDamping = true
    // 是否不变焦
    // controls.enableZoom = false
    // 是否开启阻尼
    controls.enableDamping = true
    // 动态阻尼系数 就是灵敏度
    controls.dampingFactor = 0.03
    // 设置控制器的移动
    controls.enablePan = false
    // 设置控制器的最大极角
    controls.maxPolarAngle = 1.5
    // 设置控制器的最小距离
    controls.minDistance = 50
    // 设置控制器的最大距离
    controls.maxDistance = 350
    // 平移速度
    // controls.panSpeed = 0.8
    // controls.mouseButtons = {
    //   LEFT: THREE.MOUSE.PAN,
    //   MIDDLE: THREE.MOUSE.DOLLY,
    //   RIGHT: THREE.MOUSE.ROTATE
    // }

    const stats = new Stats()
    document.documentElement.appendChild(stats.dom)
    // 监听窗口大小改变事件，调整相机的宽高比，并重新渲染
    window.addEventListener(
      'resize',
      () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
    initLight(scene)
    const { water } = initWater(scene)
    const { sky } = initSky(scene)
    const { sun } = initSun(renderer, scene, sky, water)

    // 创建加载管理器
    const manager = new THREE.LoadingManager()
    // 设置加载进度回调函数
    manager.onProgress = async (url, loaded, total) => {
      // 加载进度达到100%时，执行回调函数
      if (Math.floor((loaded / total) * 100) === 100) {
        setLoadingProcess(Math.floor((loaded / total) * 100))
        // 执行动画，让相机移动到指定位置，并设置场景准备完毕
        Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 4000, () => {
          setSceneReady(true)
        })
      } else {
        setLoadingProcess(Math.floor((loaded / total) * 100))
      }
    }

    // 岛1
    // 创建一个GLTFLoader实例
    const loader = new GLTFLoader(manager)
    // 加载islandModel文件，并传入回调函数
    loader.load(islandModel, mesh => {
      // 遍历场景中的每一个子对象
      mesh.scene.traverse(child => {
        // 如果子对象是网格
        if (child.isMesh) {
          // 设置网格的材质的亮度
          child.material.metalness = 0.4
          // 设置网格的材质的粗糙度
          child.material.roughness = 0.6
        }
      })
      // 设置场景的位置
      mesh.scene.position.set(0, -1, 0)
      // 设置场景的缩放比例
      mesh.scene.scale.set(33, 33, 33)
      // 将场景添加到scene中
      scene.add(mesh.scene)
    })

    // 岛2
    // 加载islandModel文件，并传入回调函数
    loader.load(issum_the_town_on_capital_isle, mesh => {
      // 遍历场景中的每一个子对象
      mesh.scene.traverse(child => {
        // 如果子对象是网格
        if (child.isMesh) {
          // 设置网格的材质的亮度
          child.material.metalness = 0.4
          // 设置网格的材质的粗糙度
          child.material.roughness = 0.6
        }
      })
      // 设置场景的位置
      mesh.scene.position.set(800, -1, 0)
      // 设置场景的缩放比例
      mesh.scene.scale.set(5, 5, 5)
      // 将场景添加到scene中
      scene.add(mesh.scene)
    })

    // 鸟
    const radius = 200 // 圆形轨道半径
    const speed = 0.01 // 绕行速度
    let rotationAngle = 0 // 初始旋转角度
    let angle = 0 // 初始角度
    // 加载flamingoModel模型，并将其赋值给loader
    loader.load(flamingoModel, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(0.35, 0.35, 0.35)
      // 设置模型的位置
      mesh.position.set(-100, 80, -300)
      // 设置模型的旋转角度
      mesh.rotation.y = 1
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)

      // 克隆模型，并将其位置设置为(150, 80, -500)
      const bird2 = mesh.clone()
      bird2.position.set(150, 80, -500)
      // 将克隆的模型添加到场景中
      scene.add(bird2)

      // 创建一个动画混合器，并将其赋值给mixer
      const mixer = new THREE.AnimationMixer(mesh)
      // 设置动画混合器的持续时间，并播放动画
      mixer.clipAction(gltf.animations[0]).setDuration(1.8).play()
      // 将动画混合器添加到mixers数组中
      mixers.push(mixer)

      // 创建一个动画混合器，并将其赋值给mixer2
      const mixer2 = new THREE.AnimationMixer(bird2)
      // 设置动画混合器的持续时间，并播放动画
      mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play()
      // 将动画混合器添加到mixers数组中
      mixers.push(mixer2)
      function animatex() {
        requestAnimationFrame(animatex)
        // 更新角度
        angle += speed
        rotationAngle -= speed
        // 计算模型在圆形轨道上的位置
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        // 更新模型位置
        mesh.position.set(x, 80, z)
        // 计算模型的旋转角度
        mesh.rotation.y = rotationAngle
        bird2.rotation.y = -rotationAngle
        bird2.position.set(-x, 120, z)
      }
      animatex()
    })
    // 裂空坐
    loader.load(rayquazaRemastered, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(15, 15, 15)
      // 设置模型的位置
      mesh.position.set(10, 50, 0)
      // 设置模型的旋转角度
      mesh.rotation.y = 0
      mesh.rotation.z = 3.5
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)
      // 创建一个动画混合器，并将其赋值给mixer
      const mixer = new THREE.AnimationMixer(mesh)
      // 设置动画混合器的持续时间，并播放动画
      mixer.clipAction(gltf.animations[0]).setDuration(3).play()
      // 将动画混合器添加到mixers数组中
      mixers.push(mixer)
    })

    // 固拉多
    loader.load(primoGroudon, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(3, 3, 3)
      // 设置模型的位置
      mesh.position.set(100, 0, 80)
      // 设置模型的旋转角度
      mesh.rotation.y = 0
      mesh.rotation.z = 0
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)
    })

    // 海皇牙
    loader.load(kyogrePrimal, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(3, 3, 3)
      // 设置模型的位置
      mesh.position.set(-180, 0, 138)
      // 设置模型的旋转角度
      mesh.rotation.y = 0
      mesh.rotation.z = 0
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)
      function animate() {
        requestAnimationFrame(animate)
        // 更新角度
        angle += speed * 0.01
        rotationAngle -= speed * 0.01
        // 计算模型在圆形轨道上的位置
        const x = 320 * Math.cos(angle)
        const z = 320 * Math.sin(angle)
        // 更新模型位置
        mesh.position.set(x, 0, z)
        // 计算模型的旋转角度
        mesh.rotation.z = rotationAngle
      }
      // animate()
    })

    // 闪电鸟
    loader.load(zapdosGalarian, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(25, 25, 25)
      // 设置模型的位置
      mesh.position.set(-70, 45, 138)
      // 设置模型的旋转角度
      mesh.rotation.y = 0
      mesh.rotation.z = 0
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)
      // 创建一个动画混合器，并将其赋值给mixer
      const mixer = new THREE.AnimationMixer(mesh)
      // 设置动画混合器的持续时间，并播放动画
      mixer.clipAction(gltf.animations[0]).setDuration(3).play()
      // 将动画混合器添加到mixers数组中
      mixers.push(mixer)
    })

    // 凤凰
    // 加载flamingoModel模型，并将其赋值给loader
    loader.load(fh, gltf => {
      // 获取模型中的场景，并将其赋值给mesh
      const mesh = gltf.scene.children[0]
      // 设置模型的缩放比例
      mesh.scale.set(0.05, 0.05, 0.05)
      // 设置模型的位置
      mesh.position.set(1000, 80, -300)
      // 设置模型的旋转角度
      mesh.rotation.y = 1
      // 设置模型的阴影
      mesh.castShadow = true
      // 将模型添加到场景中
      scene.add(mesh)
      // 创建一个动画混合器，并将其赋值给mixer
      const mixer = new THREE.AnimationMixer(mesh)
      // 设置动画混合器的持续时间，并播放动画
      mixer.clipAction(gltf.animations[0]).setDuration(3).play()
      // 将动画混合器添加到mixers数组中
      mixers.push(mixer)
      function animatex() {
        requestAnimationFrame(animatex)
        // 更新角度
        angle += speed
        rotationAngle -= speed
        // 计算模型在圆形轨道上的位置
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        // 更新模型位置
        mesh.position.set(x, 80, z)
        // 计算模型的旋转角度
        mesh.rotation.y = rotationAngle
        // 计算模型位置
      }
      // animatex()
    })

    // 虹
    // 创建一个THREE.ShaderMaterial对象，用于渲染模型
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      // 定义uniforms属性，用于定义着色器中的变量
      uniforms: {},
      // 定义vertexShader属性，用于定义顶点着色器
      vertexShader: vertexShader,
      // 定义fragmentShader属性，用于定义片元着色器
      fragmentShader: fragmentShader
    })
    // 创建一个THREE.TorusGeometry对象，用于创建模型
    const geometry = new THREE.TorusGeometry(200, 10, 50, 100)
    // 创建一个THREE.Mesh对象，用于渲染模型
    const torus = new THREE.Mesh(geometry, material)
    // 设置模型的透明度
    torus.opacity = 0.1
    // 设置模型的位置
    torus.position.set(0, -50, -400)
    // 将模型添加到场景中
    scene.add(torus)

    // 点
    const raycaster = new THREE.Raycaster()
    const points = [
      {
        position: new THREE.Vector3(10, 46, 0),
        element: document.querySelector('.point-0')
      },
      {
        position: new THREE.Vector3(-10, 8, 24),
        element: document.querySelector('.point-1')
      },
      {
        position: new THREE.Vector3(30, 10, 70),
        element: document.querySelector('.point-2')
      },
      {
        position: new THREE.Vector3(-100, 50, -300),
        element: document.querySelector('.point-3')
      },
      {
        position: new THREE.Vector3(-120, 50, -100),
        element: document.querySelector('.point-4')
      },
      {
        position: new THREE.Vector3(-1000, 50, -100),
        element: document.querySelector('.point-5')
      }
    ]
    function initTween(start, target, delay) {
      const tween = new TWEEN.Tween(start).to(target, delay || 1000)
      tween.start()
    }
    // 滚动延迟函数
    function stopWheel() {
      if (moveWheelStart) {
        isWheel = false
        moveWheelStart = false
        moveWheelStop = true
        // 这里写停止时调用的方法
      }
    }
    let wheelClock, isClick
    // 执行滚动动画
    let isWheel = false
    // 滚动方向
    let wheelDelta = false
    let moveWheelStop = true
    let moveWheelStart = false
    // 滚轮动画
    function initScroll() {
      const cp = camera.position
      if (wheelDelta) {
        // 前
        cp.y -= 1
      } else {
        cp.y += 2
      }
    }
    // 监听鼠标滚动
    function onDocumentMouseWheel(event) {
      // controls.noZoom = controls.maxDistance > 1000
      isWheel = true
      if (event.wheelDelta > 0) {
        wheelDelta = true
      } else if (event.wheelDelta < 0) {
        wheelDelta = false
      }
      // 滚动
      if (moveWheelStop) {
        moveWheelStop = false
        moveWheelStart = true
        wheelClock = setTimeout(stopWheel, 800)
      } else {
        clearTimeout(wheelClock)
        wheelClock = setTimeout(stopWheel, 800)
      }
      camera.lookAt(scene.position)
      camera.updateProjectionMatrix()
    }
    const map = document.querySelector('canvas.webgl')
    map.addEventListener('wheel', onDocumentMouseWheel)
    // 遍历所有点元素，添加点击事件
    document.querySelectorAll('.point').forEach(item => {
      item.addEventListener(
        'click',
        event => {
          // 获取点击的元素的className
          let className = event.target.classList[event.target.classList.length - 1]
          // 根据className执行不同的动画
          switch (className) {
            case 'label-0':
              Animations.animateCamera(camera, controls, { x: -15, y: 80, z: 60 }, { x: 0, y: 0, z: 0 }, 1600, () => {})
              break
            case 'label-1':
              Animations.animateCamera(camera, controls, { x: -20, y: 10, z: 60 }, { x: 0, y: 0, z: 0 }, 1600, () => {})
              break
            case 'label-2':
              Animations.animateCamera(camera, controls, { x: 30, y: 10, z: 100 }, { x: 0, y: 0, z: 0 }, 1600, () => {})
              break
            case 'label-5':
              Animations.animateCamera(
                camera,
                controls,
                { x: 800, y: 10, z: 140 },
                { x: 800, y: 0, z: 0 },
                4000,
                () => {}
              )
              break
            default:
              Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 1600, () => {})
              break
          }
        },
        false
      )
    })

    const animate = () => {
      requestAnimationFrame(animate)
      // 更新uniforms
      water.material.uniforms['time'].value += 1.0 / 30.0
      // 更新状态
      stats && stats.update()
      // 更新控制器
      controls && controls.update()
      // 更新动画
      const delta = clock.getDelta()
      mixers &&
        mixers.forEach(item => {
          item.update(delta)
        })
      // 更新TWEEN动画
      const timer = Date.now() * 0.0005
      TWEEN && TWEEN.update()
      // 更新相机位置
      camera && (camera.position.y += Math.sin(timer) * 0.05)
      if (sceneReady) {
        // 遍历每个点
        for (const point of points) {
          // 获取2D屏幕位置
          const screenPosition = point.position.clone()
          screenPosition.project(camera)
          raycaster.setFromCamera(screenPosition, camera)
          const intersects = raycaster.intersectObjects(scene.children, true)
          if (intersects.length === 0) {
            // 未找到相交点，显示
            point.element.classList.add('visible')
          } else {
            // 找到相交点
            // 获取相交点的距离和点的距离
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.position)
            // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
            intersectionDistance < pointDistance
              ? point.element.classList.remove('visible')
              : point.element.classList.add('visible')
          }
          const translateX = screenPosition.x * sizes.width * 0.5
          const translateY = -screenPosition.y * sizes.height * 0.5
          point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
      }
      // 滚轮动画
      isWheel && initScroll()
      renderer.render(scene, camera)
    }
    animate()
  }

  const renderLoading = () => {
    if (loadingProcess === 100) {
      return null
    } else {
      return (
        <div className="loading">
          <span className="progress">{loadingProcess} %</span>
        </div>
      )
    }
  }

  return (
    <div className="ocean">
      <canvas className="webgl"></canvas>
      {renderLoading()}
      <div className="point point-0">
        <div className="label label-0">1</div>
        <div className="text">
          灯塔：矗立在海岸的岩石之上，白色的塔身以及红色的塔屋，在湛蓝色的天空和深蓝色大海的映衬下，显得如此醒目和美丽。
        </div>
      </div>
      <div className="point point-1">
        <div className="label label-1">2</div>
        <div className="text">
          小船：梦中又见那宁静的大海，我前进了，驶向远方，我知道我是船，只属于远方。这一天，我用奋斗作为白帆，要和明天一起飘扬，呼喊。
        </div>
      </div>
      <div className="point point-2">
        <div className="label label-2">3</div>
        <div className="text">
          沙滩：宇宙展开的一小角。不想说来这里是暗自疗伤，那过于矫情，只想对每一粒沙子，每一朵浪花问声你们好吗
        </div>
      </div>
      <div className="point point-3">
        <div className="label label-3">4</div>
        <div className="text">
          飞鸟：在苍茫的大海上，狂风卷集着乌云。在乌云和大海之间，海燕像黑色的闪电，在高傲地飞翔。
        </div>
      </div>
      <div className="point point-4">
        <div className="label label-4">5</div>
        <div className="text">礁石：寂寞又怎么样？礁石都不说话，但是水流过去之后，礁石留下。</div>
      </div>
      <div className="point point-5">
        <div className="label label-5">岛2</div>
        <div className="text">黑暗森林。</div>
      </div>
    </div>
  )
}
