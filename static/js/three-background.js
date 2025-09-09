// Three.js animated background for Lunar Vault
class ThreeBackground {
    constructor() {
        // Core objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.nebula = null;
        this.stars = null;

        // Animation control
        this.animationId = null;
        this.lastFrameTime = 0;
        this.paused = false;

        // Settings
        this.settings = {
            backgroundAnimation: false,
            quality: 'medium', // off | low | medium | high
            targetFPS: 45
        };

        this.loadSettings();

        if (!this.settings.backgroundAnimation || this.settings.quality === 'off') {
            const container = document.getElementById('three-background');
            if (container) container.style.display = 'none';
            return; // Do not initialize heavy background
        }

        // Frame interval from target FPS
        this.frameInterval = 1000 / this.settings.targetFPS;

        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createNebula();
        this.createStars();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('three-background');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }
    
    createNebula() {
        // Orange → Teal spectrum for brand gradient
        const nebulaGroup = new THREE.Group();
        const palette = [
            new THREE.Color(0xff4500), // orange
            new THREE.Color(0xff7a33), // softer orange
            new THREE.Color(0x22c1c3), // teal-ish mid
            new THREE.Color(0x0ea5e9)  // teal
        ];

        for (let i = 0; i < palette.length; i++) {
            const geometry = new THREE.SphereGeometry(25 + i * 8, 48, 48);
            const material = new THREE.MeshBasicMaterial({
                color: palette[i],
                transparent: true,
                opacity: (this.settings.quality === 'high' ? 0.10 : 0.07) - i * 0.015,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });

            const nebula = new THREE.Mesh(geometry, material);
            nebula.position.set(
                (Math.random() - 0.5) * 120,
                (Math.random() - 0.5) * 120,
                -60 - i * 15
            );

            nebula.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            nebulaGroup.add(nebula);
        }

        this.nebula = nebulaGroup;
        this.scene.add(this.nebula);
    }
    
    createStars() {
        const counts = { high: 3000, medium: 2000, low: 1000 };
        const starCount = counts[this.settings.quality] || 2000;
        const starGeometry = new THREE.BufferGeometry();

        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 2000;     // x
            starPositions[i + 1] = (Math.random() - 0.5) * 2000; // y
            starPositions[i + 2] = (Math.random() - 0.5) * 2000; // z
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createParticles() {
        // Create floating cosmic dust particles
        const counts = { high: 800, medium: 500, low: 250 };
        const particleCount = counts[this.settings.quality] || 500;

        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities = [];

        // Motion scale based on quality
        const velScale = this.settings.quality === 'high' ? 0.025 : (this.settings.quality === 'low' ? 0.012 : 0.02);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            particlePositions[i3] = (Math.random() - 0.5) * 200;     // x
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 200; // y
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 200; // z

            particleVelocities.push({
                x: (Math.random() - 0.5) * velScale,
                y: (Math.random() - 0.5) * velScale,
                z: (Math.random() - 0.5) * velScale
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x0ea5e9, // Teal end of brand gradient
            size: 1.5,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.particles.velocities = particleVelocities;
        this.scene.add(this.particles);
    }
    
    animate(timestamp = 0) {
        if (this.paused) return;

        this.animationId = requestAnimationFrame((t) => this.animate(t));

        // FPS cap
        const delta = timestamp - this.lastFrameTime;
        if (delta < this.frameInterval) {
            return;
        }
        this.lastFrameTime = timestamp;

        // Rotate nebula slowly
        if (this.nebula) {
            const speedScale = this.settings.quality === 'high' ? 1 : (this.settings.quality === 'low' ? 0.6 : 0.8);
            this.nebula.rotation.x += 0.0005 * speedScale;
            this.nebula.rotation.y += 0.0003 * speedScale;
            this.nebula.rotation.z += 0.0002 * speedScale;
        }

        // Rotate stars
        if (this.stars) {
            this.stars.rotation.x += 0.00008;
            this.stars.rotation.y += 0.00016;
        }

        // Animate particles
        if (this.particles && this.particles.velocities) {
            const positions = this.particles.geometry.attributes.position.array;

            for (let i = 0; i < this.particles.velocities.length; i++) {
                const i3 = i * 3;
                const velocity = this.particles.velocities[i];

                positions[i3] += velocity.x;
                positions[i3 + 1] += velocity.y;
                positions[i3 + 2] += velocity.z;

                // Wrap particles around
                if (Math.abs(positions[i3]) > 100) velocity.x *= -1;
                if (Math.abs(positions[i3 + 1]) > 100) velocity.y *= -1;
                if (Math.abs(positions[i3 + 2]) > 100) velocity.z *= -1;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Subtle camera movement
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.sin(time) * 2;
        this.camera.position.y = Math.cos(time * 0.7) * 1;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        // Pause when tab hidden, resume when visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Theme change listener
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    updateTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Update particle colors based on theme (orange on light, teal on dark)
        if (this.particles) {
            this.particles.material.color.setHex(isDark ? 0x0ea5e9 : 0xff4500);
        }

        // Update nebula opacity based on theme
        if (this.nebula) {
            this.nebula.children.forEach((child, index) => {
                child.material.opacity = isDark ? (0.10 - index * 0.02) : (0.06 - index * 0.01);
            });
        }

        // Update fog
        this.scene.fog.color.setHex(isDark ? 0x000000 : 0x1e293b);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Clean up geometries and materials
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        const container = document.getElementById('three-background');
        if (container && this.renderer && this.renderer.domElement) {
            container.removeChild(this.renderer.domElement);
        }
    }
    
    // Method to add special effects for user interactions
    addEnergyPulse(intensity = 1) {
        if (this.particles) {
            const originalOpacity = this.particles.material.opacity;
            this.particles.material.opacity = Math.min(1, originalOpacity * (1 + intensity));

            setTimeout(() => {
                this.particles.material.opacity = originalOpacity;
            }, 1000);
        }
    }

    pause() {
        if (this.paused) return;
        this.paused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.paused) return;
        this.paused = false;
        this.lastFrameTime = 0;
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    loadSettings() {
        try {
            // Background animation on/off
            const bg = localStorage.getItem('lv.backgroundAnimation');
            if (bg === 'off') this.settings.backgroundAnimation = false;

            // Particle quality preference
            const q = localStorage.getItem('lv.particlesQuality');
            if (q && ['off', 'low', 'medium', 'high'].includes(q)) {
                this.settings.quality = q;
            }

            // Respect reduced motion
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.settings.quality = this.settings.quality === 'off' ? 'off' : 'low';
                this.settings.targetFPS = 30;
            } else {
                // Target FPS by quality
                this.settings.targetFPS = this.settings.quality === 'high' ? 60 : (this.settings.quality === 'low' ? 30 : 45);
            }
        } catch (e) {
            // Fallbacks already set
        }
    }
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Three.js is available
    if (typeof THREE !== 'undefined') {
        window.threeBackground = new ThreeBackground();
    } else {
        console.warn('Three.js not loaded, background animation disabled');
    }
});

// Export for use in other modules
window.ThreeBackground = ThreeBackground;
