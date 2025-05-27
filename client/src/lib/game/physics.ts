export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  min: Vector3;
  max: Vector3;
}

export interface PhysicsBody {
  position: Vector3;
  velocity: Vector3;
  size: Vector3;
  mass: number;
  isStatic: boolean;
  onGround: boolean;
}

// Create a physics body
export function createPhysicsBody(
  position: Vector3,
  size: Vector3,
  mass: number = 1,
  isStatic: boolean = false
): PhysicsBody {
  return {
    position: { ...position },
    velocity: { x: 0, y: 0, z: 0 },
    size: { ...size },
    mass,
    isStatic,
    onGround: false
  };
}

// Update physics body with simple integration
export function updatePhysics(body: PhysicsBody, deltaTime: number): void {
  if (body.isStatic) return;
  
  // Apply gravity
  const gravity = -9.81;
  if (!body.onGround) {
    body.velocity.y += gravity * deltaTime;
  }
  
  // Update position based on velocity
  body.position.x += body.velocity.x * deltaTime;
  body.position.y += body.velocity.y * deltaTime;
  body.position.z += body.velocity.z * deltaTime;
  
  // Simple ground collision
  if (body.position.y <= 0) {
    body.position.y = 0;
    body.velocity.y = 0;
    body.onGround = true;
  } else {
    body.onGround = false;
  }
  
  // Apply basic friction when on ground
  if (body.onGround) {
    body.velocity.x *= 0.8;
    body.velocity.z *= 0.8;
  }
}

// Create AABB from physics body
export function createAABB(body: PhysicsBody): AABB {
  const halfSize = {
    x: body.size.x / 2,
    y: body.size.y / 2,
    z: body.size.z / 2
  };
  
  return {
    min: {
      x: body.position.x - halfSize.x,
      y: body.position.y - halfSize.y,
      z: body.position.z - halfSize.z
    },
    max: {
      x: body.position.x + halfSize.x,
      y: body.position.y + halfSize.y,
      z: body.position.z + halfSize.z
    }
  };
}

// Check AABB collision
export function checkAABBCollision(aabb1: AABB, aabb2: AABB): boolean {
  return (
    aabb1.min.x <= aabb2.max.x &&
    aabb1.max.x >= aabb2.min.x &&
    aabb1.min.y <= aabb2.max.y &&
    aabb1.max.y >= aabb2.min.y &&
    aabb1.min.z <= aabb2.max.z &&
    aabb1.max.z >= aabb2.min.z
  );
}

// Resolve collision between two physics bodies
export function resolveCollision(body1: PhysicsBody, body2: PhysicsBody): void {
  if (body1.isStatic && body2.isStatic) return;
  
  const aabb1 = createAABB(body1);
  const aabb2 = createAABB(body2);
  
  if (!checkAABBCollision(aabb1, aabb2)) return;
  
  // Calculate overlap on each axis
  const overlapX = Math.min(aabb1.max.x - aabb2.min.x, aabb2.max.x - aabb1.min.x);
  const overlapY = Math.min(aabb1.max.y - aabb2.min.y, aabb2.max.y - aabb1.min.y);
  const overlapZ = Math.min(aabb1.max.z - aabb2.min.z, aabb2.max.z - aabb1.min.z);
  
  // Find minimum overlap axis
  let separationAxis: 'x' | 'y' | 'z' = 'x';
  let minOverlap = overlapX;
  
  if (overlapY < minOverlap) {
    minOverlap = overlapY;
    separationAxis = 'y';
  }
  
  if (overlapZ < minOverlap) {
    minOverlap = overlapZ;
    separationAxis = 'z';
  }
  
  // Separate objects along minimum overlap axis
  const separation = minOverlap / 2;
  
  if (separationAxis === 'x') {
    if (body1.position.x < body2.position.x) {
      if (!body1.isStatic) body1.position.x -= separation;
      if (!body2.isStatic) body2.position.x += separation;
    } else {
      if (!body1.isStatic) body1.position.x += separation;
      if (!body2.isStatic) body2.position.x -= separation;
    }
  } else if (separationAxis === 'z') {
    if (body1.position.z < body2.position.z) {
      if (!body1.isStatic) body1.position.z -= separation;
      if (!body2.isStatic) body2.position.z += separation;
    } else {
      if (!body1.isStatic) body1.position.z += separation;
      if (!body2.isStatic) body2.position.z -= separation;
    }
  }
}

// Calculate distance between two points
export function distance(pos1: Vector3, pos2: Vector3): number {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow(pos1.z - pos2.z, 2)
  );
}

// Calculate 2D distance (ignoring Y axis)
export function distance2D(pos1: Vector3, pos2: Vector3): number {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.z - pos2.z, 2)
  );
}

// Normalize a vector
export function normalize(vector: Vector3): Vector3 {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

// Linear interpolation between two vectors
export function lerp(start: Vector3, end: Vector3, factor: number): Vector3 {
  return {
    x: start.x + (end.x - start.x) * factor,
    y: start.y + (end.y - start.y) * factor,
    z: start.z + (end.z - start.z) * factor
  };
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Check if a point is within bounds
export function isWithinBounds(
  position: Vector3,
  bounds: { min: Vector3; max: Vector3 }
): boolean {
  return (
    position.x >= bounds.min.x && position.x <= bounds.max.x &&
    position.y >= bounds.min.y && position.y <= bounds.max.y &&
    position.z >= bounds.min.z && position.z <= bounds.max.z
  );
}
