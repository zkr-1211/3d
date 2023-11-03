import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water'
import waterTexture from '@/containers/Ocean/images/waternormals.jpg'
export function initWater(scene) {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
  // 创建一个水体，使用上面创建的平面几何体，以及一些参数
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    // 加载法线贴图，并设置其环绕方式为重复
    waterNormals: new THREE.TextureLoader().load(waterTexture, texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    // 设置太阳方向
    sunDirection: new THREE.Vector3(),
    // 设置太阳颜色
    sunColor: 0xffffff,
    // 设置水体颜色
    waterColor: 0x0072ff,
    // 设置水体失真系数
    distortionScale: 4,
    // 设置雾
    fog: scene.fog !== undefined
  })
  // 设置水体的旋转角度
  water.rotation.x = -Math.PI / 2
  // 将水体添加到场景中
  scene.add(water)
  return {
    water
  }
}
