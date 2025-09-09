// Energy Flow Visualization using Three.js
class EnergyFlowVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;
        
        this.nodes = {};
        this.particles = [];
        this.connections = [];
        
        this.energyData = {
            solar_production: 0,
            home_consumption: 0,
            grid_import: 0,
            grid_export: 0,
            battery_level: 50,
            battery_charge_rate: 0
        };
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createNodes();
        this.createConnections();
        this.animate();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
    }
    
    createCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 20;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    createNodes() {
        // Solar panel node (top)
        this.nodes.solar = this.createNode(0, 8, 0, 0xf59e0b, 'solar');
        
        // Home node (center)
        this.nodes.home = this.createNode(0, 0, 0, 0x10b981, 'home');
        
        // Grid node (left)
        this.nodes.grid = this.createNode(-10, 0, 0, 0x8b5cf6, 'grid');
        
        // Battery node (right)
        this.nodes.battery = this.createNode(10, 0, 0, 0x00d4ff, 'battery');
        
        // Add nodes to scene
        Object.values(this.nodes).forEach(node => {
            this.scene.add(node);
        });
    }
    
    createNode(x, y, z, color, type) {
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const node = new THREE.Mesh(geometry, material);
        node.position.set(x, y, z);
        node.userData = { type, originalColor: color };
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        node.add(glow);
        
        return node;
    }
    
    createConnections() {
        // Create lines between nodes
        this.connections.push(this.createConnection(this.nodes.solar, this.nodes.home));
        this.connections.push(this.createConnection(this.nodes.grid, this.nodes.home));
        this.connections.push(this.createConnection(this.nodes.home, this.nodes.battery));
        this.connections.push(this.createConnection(this.nodes.grid, this.nodes.battery));
        
        this.connections.forEach(connection => {
            this.scene.add(connection);
        });
    }
    
    createConnection(nodeA, nodeB) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            nodeA.position.x, nodeA.position.y, nodeA.position.z,
            nodeB.position.x, nodeB.position.y, nodeB.position.z
        ]);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.3
        });
        
        return new THREE.Line(geometry, material);
    }
    
    update(energyData) {
        this.energyData = energyData;
        this.updateNodeIntensities();
        this.updateParticleFlows();
    }
    
    updateNodeIntensities() {
        // Solar node intensity based on production
        const solarIntensity = Math.min(1, this.energyData.solar_production / 10);
        this.updateNodeGlow(this.nodes.solar, solarIntensity);
        
        // Home node intensity based on consumption
        const homeIntensity = Math.min(1, this.energyData.home_consumption / 10);
        this.updateNodeGlow(this.nodes.home, homeIntensity);
        
        // Grid node intensity based on import/export
        const gridActivity = Math.max(this.energyData.grid_import, this.energyData.grid_export);
        const gridIntensity = Math.min(1, gridActivity / 10);
        this.updateNodeGlow(this.nodes.grid, gridIntensity);
        
        // Battery node intensity based on charge rate
        const batteryActivity = Math.abs(this.energyData.battery_charge_rate);
        const batteryIntensity = Math.min(1, batteryActivity / 5);
        this.updateNodeGlow(this.nodes.battery, batteryIntensity);
    }
    
    updateNodeGlow(node, intensity) {
        const glow = node.children[0];
        if (glow) {
            glow.material.opacity = 0.2 + (intensity * 0.3);
            glow.scale.setScalar(1 + intensity * 0.5);
        }
    }
    
    updateParticleFlows() {
        // Clear existing particles
        this.particles.forEach(particle => {
            this.scene.remove(particle);
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
        });
        this.particles = [];
        
        // Solar to Home flow
        if (this.energyData.solar_production > 0.1) {
            this.createParticleFlow(
                this.nodes.solar.position,
                this.nodes.home.position,
                this.energyData.solar_production,
                0xf59e0b
            );
        }
        
        // Grid to Home flow (import)
        if (this.energyData.grid_import > 0.1) {
            this.createParticleFlow(
                this.nodes.grid.position,
                this.nodes.home.position,
                this.energyData.grid_import,
                0x8b5cf6
            );
        }
        
        // Home to Grid flow (export)
        if (this.energyData.grid_export > 0.1) {
            this.createParticleFlow(
                this.nodes.home.position,
                this.nodes.grid.position,
                this.energyData.grid_export,
                0x10b981
            );
        }
        
        // Battery charging/discharging
        if (Math.abs(this.energyData.battery_charge_rate) > 0.1) {
            if (this.energyData.battery_charge_rate > 0) {
                // Charging: Home to Battery
                this.createParticleFlow(
                    this.nodes.home.position,
                    this.nodes.battery.position,
                    this.energyData.battery_charge_rate,
                    0x00d4ff
                );
            } else {
                // Discharging: Battery to Home
                this.createParticleFlow(
                    this.nodes.battery.position,
                    this.nodes.home.position,
                    Math.abs(this.energyData.battery_charge_rate),
                    0x00d4ff
                );
            }
        }
    }
    
    createParticleFlow(startPos, endPos, intensity, color) {
        const particleCount = Math.ceil(intensity * 5);
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random starting position along the path
            const progress = Math.random();
            particle.position.lerpVectors(startPos, endPos, progress);
            
            // Store animation data
            particle.userData = {
                startPos: startPos.clone(),
                endPos: endPos.clone(),
                progress: progress,
                speed: 0.02 + Math.random() * 0.02,
                startTime: Date.now() + Math.random() * 2000
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const currentTime = Date.now();
        
        // Animate particles
        this.particles.forEach(particle => {
            if (currentTime < particle.userData.startTime) return;
            
            particle.userData.progress += particle.userData.speed;
            
            if (particle.userData.progress >= 1) {
                // Reset particle
                particle.userData.progress = 0;
                particle.userData.startTime = currentTime + Math.random() * 1000;
            }
            
            // Update position
            particle.position.lerpVectors(
                particle.userData.startPos,
                particle.userData.endPos,
                particle.userData.progress
            );
            
            // Fade effect
            const fadeProgress = Math.sin(particle.userData.progress * Math.PI);
            particle.material.opacity = 0.8 * fadeProgress;
        });
        
        // Rotate nodes slightly
        Object.values(this.nodes).forEach(node => {
            node.rotation.y += 0.01;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    resize() {
        if (!this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up
        this.particles.forEach(particle => {
            this.scene.remove(particle);
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
        });
        
        this.connections.forEach(connection => {
            this.scene.remove(connection);
            if (connection.geometry) connection.geometry.dispose();
            if (connection.material) connection.material.dispose();
        });
        
        Object.values(this.nodes).forEach(node => {
            this.scene.remove(node);
            if (node.geometry) node.geometry.dispose();
            if (node.material) node.material.dispose();
        });
        
        this.renderer.dispose();
        
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Initialize energy flow visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined' && document.getElementById('energy-flow-container')) {
        window.EnergyFlowVisualizer = new EnergyFlowVisualizer('energy-flow-container');
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.EnergyFlowVisualizer) {
                window.EnergyFlowVisualizer.resize();
            }
        });
    }
});

// Export for use in other modules
window.EnergyFlowVisualizerClass = EnergyFlowVisualizer;
