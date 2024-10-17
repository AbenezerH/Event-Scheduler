const FloatingShapes = () => {
    const shapes = Array(5).fill().map((_, i) => ({
        size: Math.random() * 100 + 50,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
    }));

    return (
        <div className="animation-container">
            {shapes.map((shape, index) => (
                <div
                    key={index}
                    className="floating-shape"
                    style={{
                        width: shape.size + 'px',
                        height: shape.size + 'px',
                        left: shape.left,
                        top: shape.top,
                        animationDelay: shape.animationDelay,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingShapes;