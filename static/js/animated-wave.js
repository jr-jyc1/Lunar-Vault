// Animated Wave Background for Login Page
class AnimatedWave {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            speed: 0.015,
            amplitude: 30,
            smoothness: 300,
            wireframe: true,
            waveColor: '#ff4500',
            opacity: 1,
            mouseInteraction: true,
            quality: 'medium',
            fov: 60,
            waveOffsetY: -300,
            waveRotation: 29.8,
            cameraDistance: -1000,
            ease: 12,
            mouseDistortionStrength: 0.5,
            mouseDistortionSmoothness: 100,
            mouseDistortionDecay: 0.0005,
            mouseShrinkScaleStrength: 0.7,
            mouseShrinkScaleRadius: 200,
            ...options
        };

        this.sceneElements = {
            scene: null,
            camera: null,
            renderer: null,
            groundPlain: null,
            animationFrameId: null,
            mouse: { x: 0, y: 0 }
        };

        this.webGLFailed = false;
        this.init();
    }

    init() {
        this.setupScene();
    }

    getDeviceInfo() {
        return {
            screenWidth: () => Math.max(0, window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0),
            screenHeight: () => Math.max(0, window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0),
            screenRatio: function() { return this.screenWidth() / this.screenHeight(); },
            screenCenterX: function() { return this.screenWidth() / 2; },
            screenCenterY: function() { return this.screenHeight() / 2; },
            mouseCenterX: function(e) { return e.clientX - this.screenCenterX(); },
            mouseCenterY: function(e) { return e.clientY - this.screenCenterY(); }
        };
    }

    getQualitySettings(quality) {
        switch (quality) {
            case "low": return { width: 64, height: 32 };
            case "high": return { width: 256, height: 128 };
            default: return { width: 128, height: 64 };
        }
    }

    createGroundPlain() {
        const { width: geometryWidth, height: geometryHeight } = this.getQualitySettings(this.options.quality);

        const groundPlain = {
            group: null,
            geometry: null,
            material: null,
            plane: null,
            simplex: null,
            factor: this.options.smoothness,
            scale: this.options.amplitude,
            speed: this.options.speed,
            cycle: 0,
            ease: this.options.ease,
            move: new THREE.Vector3(0, this.options.waveOffsetY, this.options.cameraDistance),
            look: new THREE.Vector3((this.options.waveRotation * Math.PI) / 180, 0, 0),
            mouseDistortionStrength: this.options.mouseDistortionStrength,
            mouseDistortionSmoothness: this.options.mouseDistortionSmoothness,
            mouseDistortionDecay: this.options.mouseDistortionDecay,
            distortionTime: 0,
            mouseShrinkScaleStrength: this.options.mouseShrinkScaleStrength,
            mouseShrinkScaleRadius: this.options.mouseShrinkScaleRadius,
            _originalPositions: new Float32Array(),

            create: function(scene) {
                this.group = new THREE.Object3D();
                this.group.position.copy(this.move);
                this.group.rotation.copy(this.look);

                this.geometry = new THREE.PlaneGeometry(4000, 2000, geometryWidth, geometryHeight);
                this._originalPositions = new Float32Array(this.geometry.attributes.position.array);

                this.material = new THREE.MeshLambertMaterial({
                    color: this.parseColor('#ff4500'),
                    opacity: this.opacity,
                    blending: this.opacity < 1 ? THREE.NormalBlending : THREE.NoBlending,
                    side: THREE.DoubleSide,
                    transparent: this.opacity < 1,
                    depthWrite: this.opacity < 1 ? false : true,
                    wireframe: this.wireframe
                });

                this.plane = new THREE.Mesh(this.geometry, this.material);
                this.plane.position.set(0, 0, 0);

                this.simplex = createNoise2D();
                this.moveNoise({ x: 0, y: 0 });

                this.group.add(this.plane);
                scene.add(this.group);
            }.bind(this),

            parseColor: function(color) {
                try {
                    return new THREE.Color(color);
                } catch (error) {
                    return new THREE.Color(0xff4500);
                }
            },

            moveNoise: function(mouse) {
                if (!this.geometry || !this.simplex || !this._originalPositions) return;

                const positions = this.geometry.attributes.position;
                const currentMouseX = this.mouseInteraction ? mouse.x : 0;
                const currentMouseY = this.mouseInteraction ? mouse.y : 0;

                this.distortionTime += this.mouseDistortionDecay;

                for (let i = 0; i < positions.count; i++) {
                    const originalX = this._originalPositions[i * 3];
                    const originalY = this._originalPositions[i * 3 + 1];

                    let newX = originalX;
                    let newY = originalY;

                    const xoff_wave = originalX / this.factor;
                    const yoff_wave = originalY / this.factor + this.cycle;
                    let zOffset = this.simplex(xoff_wave, yoff_wave) * this.scale;

                    if (this.mouseInteraction && this.mouseDistortionStrength > 0) {
                        const distX_mouse = originalX - currentMouseX * 0.5;
                        const distY_mouse = originalY - currentMouseY * 0.5;
                        const dist_mouse = Math.sqrt(distX_mouse * distX_mouse + distY_mouse * distY_mouse);

                        const mouseRippleNoise = this.simplex(
                            distX_mouse / this.mouseDistortionSmoothness,
                            distY_mouse / this.mouseDistortionSmoothness,
                            this.distortionTime
                        ) * this.mouseDistortionStrength;

                        const zFalloff = Math.max(0, 1 - dist_mouse / (this.mouseShrinkScaleRadius * 2));
                        zOffset += mouseRippleNoise * this.scale * zFalloff;
                    }

                    if (this.mouseInteraction && this.mouseShrinkScaleStrength > 0) {
                        const distX_shrink = originalX - currentMouseX;
                        const distY_shrink = originalY - currentMouseY;
                        const dist_shrink = Math.sqrt(distX_shrink * distX_shrink + distY_shrink * distY_shrink);

                        let shrinkFalloff = 0;
                        if (dist_shrink < this.mouseShrinkScaleRadius) {
                            shrinkFalloff = 1 - (dist_shrink / this.mouseShrinkScaleRadius);
                            shrinkFalloff = Math.pow(shrinkFalloff, 2);
                        }

                        const shrinkAmount = this.mouseShrinkScaleStrength * shrinkFalloff;
                        newX = originalX - distX_shrink * shrinkAmount;
                        newY = originalY - distY_shrink * shrinkAmount;
                    }

                    positions.setXYZ(i, newX, newY, zOffset);
                }

                positions.needsUpdate = true;
                this.cycle += this.speed;
            }.bind(this),

            update: function(mouse) {
                this.moveNoise(mouse);

                if (this.mouseInteraction && this.group) {
                    this.move.x = -(mouse.x * 0.04);
                    this.move.y = this.waveOffsetY + (mouse.y * 0.04);
                    this.addEase(this.group.position, this.move, this.ease);
                    this.addEase(this.group.rotation, this.look, this.ease);
                }
            }.bind(this),

            addEase: function(pos, to, ease) {
                pos.x += (to.x - pos.x) / ease;
                pos.y += (to.y - pos.y) / ease;
                pos.z += (to.z - pos.z) / ease;
            },

            dispose: function() {
                this.geometry?.dispose();
                this.material?.dispose();
                this.group?.remove(this.plane);
                this.plane = null;
                this.geometry = null;
                this.material = null;
                this.simplex = null;
                this.group = null;
                this._originalPositions = new Float32Array();
            }
        };

        // Set properties from options
        groundPlain.opacity = this.options.opacity;
        groundPlain.wireframe = this.options.wireframe;
        groundPlain.mouseInteraction = this.options.mouseInteraction;
        groundPlain.waveOffsetY = this.options.waveOffsetY;

        return groundPlain;
    }

    setupScene() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn(`Container with id '${this.containerId}' not found`);
            return;
        }

        const device = this.getDeviceInfo();

        try {
            // Create scene
            const scene = new THREE.Scene();

            // Create camera
            const camera = new THREE.PerspectiveCamera(
                this.options.fov,
                device.screenRatio(),
                0.1,
                20000
            );

            // Create renderer
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                precision: "mediump"
            });

            renderer.setSize(device.screenWidth(), device.screenHeight());
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // Add lights
            const pointLight = new THREE.PointLight(0xff4500, 4, 1000);
            pointLight.position.set(0, 200, -500);
            scene.add(pointLight);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            // Create ground plain
            const groundPlain = this.createGroundPlain();
            groundPlain.create(scene);

            this.sceneElements = {
                scene,
                camera,
                renderer,
                groundPlain,
                animationFrameId: null,
                mouse: { x: device.screenCenterX(), y: device.screenCenterY() }
            };

            this.setupEventListeners();
            this.animate();

        } catch (e) {
            console.error("Failed to create WebGL context:", e);
            this.webGLFailed = true;
        }
    }

    setupEventListeners() {
        const device = this.getDeviceInfo();

        const handleMouseMove = (e) => {
            if (!this.options.mouseInteraction) return;
            this.sceneElements.mouse.x = device.mouseCenterX(e);
            this.sceneElements.mouse.y = device.mouseCenterY(e);
        };

        const handleResize = () => {
            if (!this.sceneElements.camera || !this.sceneElements.renderer) return;
            this.sceneElements.camera.aspect = device.screenRatio();
            this.sceneElements.camera.updateProjectionMatrix();
            this.sceneElements.renderer.setSize(device.screenWidth(), device.screenHeight());
        };

        if (this.options.mouseInteraction) {
            window.addEventListener("mousemove", handleMouseMove);
        }
        window.addEventListener("resize", handleResize);
    }

    animate() {
        const animate = () => {
            if (!this.sceneElements.scene || !this.sceneElements.camera ||
                !this.sceneElements.renderer || !this.sceneElements.groundPlain) {
                return;
            }

            this.sceneElements.groundPlain.update(this.sceneElements.mouse);
            this.sceneElements.renderer.render(this.sceneElements.scene, this.sceneElements.camera);
            this.sceneElements.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
    }

    dispose() {
        if (this.sceneElements.animationFrameId) {
            cancelAnimationFrame(this.sceneElements.animationFrameId);
        }
        this.sceneElements.groundPlain?.dispose();
        this.sceneElements.renderer?.dispose();
        this.sceneElements.scene?.clear();
    }
}

// Initialize when DOM is loaded
// Background animation disabled
/*
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on login page
    if (document.getElementById('wave-container')) {
        window.animatedWave = new AnimatedWave('wave-container', {
            waveColor: '#ff4500',
            wireframe: true,
            mouseInteraction: true,
            speed: 0.015,
            amplitude: 30,
            smoothness: 300
        });
    }
});
*/