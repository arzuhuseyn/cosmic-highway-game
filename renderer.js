class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.stars = this.createStars();
    }

    createStars() {
        return Array(150).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2,
            color: this.getStarColor()
        }));
    }

    getStarColor() {
        const colors = [
            'rgba(255, 255, 255, 0.9)',    // White
            'rgba(102, 204, 255, 0.8)',    // Cyan
            'rgba(153, 102, 255, 0.7)',    // Purple
            'rgba(255, 102, 204, 0.7)',    // Pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawStars() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = star.color;
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = star.color;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Move stars to create parallax effect
            star.x -= star.speed;
            if (star.x < 0) star.x = this.canvas.width;
        });
        this.ctx.shadowBlur = 0;
    }

    clear() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a3a');
        gradient.addColorStop(1, '#0a1a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resetStars() {
        this.stars.forEach(star => {
            star.x = Math.random() * this.canvas.width;
            star.y = Math.random() * this.canvas.height;
            star.color = this.getStarColor();
        });
    }
}


