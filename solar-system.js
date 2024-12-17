// Создаем сцену, камеру и рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавляем управление камерой
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавное движение камеры
controls.dampingFactor = 0.1;

// Добавляем базовое освещение
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Мягкий свет
scene.add(ambientLight);

// Создаем источник света (Солнце)
const light = new THREE.PointLight(0xffffff, 2, 700); // Увеличенная интенсивность
light.position.set(0, 0, 0);
scene.add(light);

// Загрузка текстур
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/sun.jpg'); // Текстура Солнца
const mercuryTexture = textureLoader.load('textures/mercury.jpg');
const venusTexture = textureLoader.load('textures/venus.jpg');
const earthTexture = textureLoader.load('textures/earth.jpg');
const marsTexture = textureLoader.load('textures/mars.jpg');
const jupiterTexture = textureLoader.load('textures/jupiter.jpg');
const saturnTexture = textureLoader.load('textures/saturn.jpg');
const uranusTexture = textureLoader.load('textures/uranus.jpg');
const neptuneTexture = textureLoader.load('textures/neptune.jpg');

// Создаем Солнце
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

scene.add(sun);


// Планеты: массив объектов
const planets = [
    {name: "Mercury", size: 0.5, distance: 10, speed: 0.02, rotationSpeed: 0.05, texture: mercuryTexture},
    {name: "Venus", size: 1, distance: 15, speed: 0.015, rotationSpeed: 0.03, texture: venusTexture},
    {name: "Earth", size: 1.2, distance: 20, speed: 0.01, rotationSpeed: 0.02, texture: earthTexture},
    {name: "Mars", size: 0.8, distance: 25, speed: 0.008, rotationSpeed: 0.04, texture: marsTexture},
    {name: "Jupiter", size: 3, distance: 35, speed: 0.005, rotationSpeed: 0.01, texture: jupiterTexture},
    {name: "Saturn", size: 2.5, distance: 45, speed: 0.004, rotationSpeed: 0.01, texture: saturnTexture},
    {name: "Uranus", size: 2, distance: 55, speed: 0.003, rotationSpeed: 0.02, texture: uranusTexture},
    {name: "Neptune", size: 2, distance: 65, speed: 0.002, rotationSpeed: 0.02, texture: neptuneTexture}
];

const planetMeshes = planets.map(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({map: planet.texture});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return {...planet, mesh, angle: Math.random() * Math.PI * 2};
});

// Настраиваем камеру
camera.position.z = 80;

// Переменные для мерцания Солнца
let lightIntensityDirection = 0.1; // Направление изменения интенсивности света
const lightIntensitySpeed = 0.1; // Увеличьте скорость изменения
const lightIntensityMin = 1.0; // Минимальная интенсивность
const lightIntensityMax = 3.0; // Максимальная интенсивность

// Мерцание Солнца
light.intensity += lightIntensityDirection * lightIntensitySpeed;
if (light.intensity >= lightIntensityMax || light.intensity <= lightIntensityMin) {
    lightIntensityDirection *= -1; // Меняем направление
}

// Анимация
function animate() {
    requestAnimationFrame(animate);

    // Вращение планет вокруг Солнца и вокруг своих осей
    planetMeshes.forEach(planet => {
        // Вращение вокруг Солнца
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;

        // Вращение вокруг своей оси
        planet.mesh.rotation.y += planet.rotationSpeed;
    });

    // Вращение Солнца вокруг своей оси
    sun.rotation.y += 0.005;

    // Мерцание Солнца
    light.intensity += lightIntensityDirection * lightIntensitySpeed;
    if (light.intensity >= lightIntensityMax || light.intensity <= lightIntensityMin) {
        lightIntensityDirection *= -1; // Меняем направление
    }

    // Обновление управления камерой
    controls.update();

    renderer.render(scene, camera);
}

// Обработка изменения размера окна
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

animate();