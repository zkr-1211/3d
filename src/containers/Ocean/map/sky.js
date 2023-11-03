import { Sky } from 'three/examples/jsm/objects/Sky'
export function initSky(scene) {
  // 创建天空
  const sky = new Sky()
  // 设置天空的缩放比例
  sky.scale.setScalar(10000)
  // 将天空添加到场景中
  scene.add(sky)
  // 获取天空的uniforms
  const skyUniforms = sky.material.uniforms
  // 设置天空的亮度
  skyUniforms['turbidity'].value = 20
  // 设置天空的瑞利系数
  skyUniforms['rayleigh'].value = 2
  // 设置天空的米色系数
  skyUniforms['mieCoefficient'].value = 0.005
  // 设置天空的米色方向性
  skyUniforms['mieDirectionalG'].value = 0.8
  return { sky }
}
