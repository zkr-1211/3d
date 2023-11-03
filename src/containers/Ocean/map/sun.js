import * as THREE from 'three'
export function initSun(renderer, scene, sky, water) {
  // 太阳
  const sun = new THREE.Vector3()
  // 创建PMREMGenerator
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  // 获取太阳的极角和方位角
  const phi = THREE.MathUtils.degToRad(88)
  const theta = THREE.MathUtils.degToRad(180)
  // 计算太阳的位置
  sun.setFromSphericalCoords(1, phi, theta)
  // 设置天空的太阳位置
  sky.material.uniforms['sunPosition'].value.copy(sun)
  // 设置水的太阳方向
  water.material.uniforms['sunDirection'].value.copy(sun).normalize()
  // 设置场景的环境贴图
  scene.environment = pmremGenerator.fromScene(sky).texture
  return { sun }
}
