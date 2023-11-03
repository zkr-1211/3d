import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import lensflareTexture0 from '@/containers/Ocean/images/lensflare0.png'
import lensflareTexture1 from '@/containers/Ocean/images/lensflare1.png'
export function initLight(scene) {
    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    // 创建一个方向光
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    // 设置方向光线的颜色
    dirLight.color.setHSL(0.1, 1, 0.95)
    // 设置方向光线的方向
    dirLight.position.set(-1, 1.75, 1)
    // 将方向光线的方向乘以30
    dirLight.position.multiplyScalar(30)
    scene.add(dirLight)

    // 太阳点光源
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 2000)
    pointLight.color.setHSL(0.995, 0.5, 0.9)
    pointLight.position.set(0, 45, -2000)
    // 加载光晕贴图
    const textureLoader = new THREE.TextureLoader()
    const textureFlare0 = textureLoader.load(lensflareTexture0)
    const textureFlare1 = textureLoader.load(lensflareTexture1)
    // 镜头光晕
    const lensflare = new Lensflare()
    // 添加一个lensflare元素，参数为纹理，位置，颜色
    lensflare.addElement(new LensflareElement(textureFlare0, 600, 0, pointLight.color))
    // 添加一个lensflare元素，参数为纹理，位置，颜色
    lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.6))
    // 添加一个lensflare元素，参数为纹理，位置，颜色
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 0.7))
    // 添加一个lensflare元素，参数为纹理，位置，颜色
    lensflare.addElement(new LensflareElement(textureFlare1, 120, 0.9))
    // 添加一个lensflare元素，参数为纹理，位置，颜色
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 1))
    // 将lensflare添加到pointLight上
    pointLight.add(lensflare)
    // 将pointLight添加到scene中
    scene.add(pointLight)
  return { ambientLight }
}
