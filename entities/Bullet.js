class Bullet {
    constructor(ship) {
        this.canvas = ship.canvas;
        this.x = ship.x + ship.width;
        this.y = ship.y + ship.height / 2;
        
        // Calculate size as percentage of canvas for full responsiveness
        this.width = Math.max(this.canvas.width * 0.0125, 5); // 1.25% of canvas width, min 5px
        this.height = Math.max(this.canvas.height * 0.0033, 2); // 0.33% of canvas height, min 2px
        this.radius = Math.max(this.canvas.width * 0.01, 4); // Outer radius
        this.innerRadius = Math.max(this.canvas.width * 0.005, 2); // Inner radius
        
        // Calculate speed as percentage of canvas width for responsive behavior
        this.speed = this.canvas.width * 0.01; // 1% of canvas width
    }

    update(deltaMultiplier = 1) {
        this.x += this.speed * deltaMultiplier;
    }

    draw(ctx) {
        // Outer glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#66ccff';
        ctx.fillStyle = '#66ccff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    isOffScreen(canvas) {
        return this.x > (canvas || this.canvas).width;
    }
}


