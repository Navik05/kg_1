import * as THREE from 'three'  

export class Matrix4
{
    // Создание матрицы 4*4
    constructor() {
    this.elements = new Float32Array(16)  
    this.identity()                       
    }

    // Единичная матрица
    identity() {
        this.elements.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this
    }

    // Матрица перемещения 
    makeMov(x, y, z) {
        this.elements.set([
            1, 0, 0, 0,  
            0, 1, 0, 0,   
            0, 0, 1, 0,   
            x, y, z, 1
        ])
        return this
    }

    // Матрица масштабирования
    makeScale(x, y, z) {
        this.elements.set([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ])
        return this
    }

    // Матрица поворота вокруг оси X
    makeRotationX(angle) {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        
        this.elements.set([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ])
        return this
    }

    // Матрица поворота вокруг оси Y
    makeRotationY(angle) {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        
        this.elements.set([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ])
        return this
    }

    // Матрица поворота вокруг оси Z
    makeRotationZ(angle) {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        
        this.elements.set([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this
    }

    // Применение матрицы преобразования к точке
    transformPoint(point) {
        const x = point.x, y = point.y, z = point.z
        const m = this.elements
        
        const w = m[3] * x + m[7] * y + m[11] * z + m[15]
        
        return {
            x: (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
            y: (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
            z: (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
        }
    }

    // Общий метод для применения любого преобразования к группе
    transformGroup(group, transformationType, ...params) {
        let transformationMatrix = new Matrix4()
        
        switch(transformationType) {
            case 'mov':
                transformationMatrix = new Matrix4().makeMov(...params)
                break
            case 'scale':
                transformationMatrix = new Matrix4().makeScale(...params)
                break
            case 'rotateX':
                transformationMatrix = new Matrix4().makeRotationX(...params)
                break
            case 'rotateY':
                transformationMatrix = new Matrix4().makeRotationY(...params)
                break
            case 'rotateZ':
                transformationMatrix = new Matrix4().makeRotationZ(...params)
                break
            default:
                return group
        }
        
        // Применяем преобразование ко всем дочерним объектам группы
        group.children.forEach(child => {
            if (child.isLine) {
                const geometry = child.geometry
                const positions = geometry.attributes.position.array
                
                // Преобразуем каждую точку
                for (let i = 0; i < positions.length; i += 3) {
                    const originalPoint = {
                        x: positions[i],
                        y: positions[i + 1], 
                        z: positions[i + 2]
                    }
                    
                    const transformedPoint = transformationMatrix.transformPoint(originalPoint)
                    
                    // Обновляем координаты в геометрии
                    positions[i] = transformedPoint.x
                    positions[i + 1] = transformedPoint.y
                    positions[i + 2] = transformedPoint.z
                }
                
                // Обновляем геометрию
                geometry.attributes.position.needsUpdate = true
                geometry.computeBoundingSphere()
            }
        })
        
        return group
    }

    // Методы быстрого вызова
    movGroup(group, tx, ty, tz) {
        return this.transformGroup(group, 'mov', tx, ty, tz)
    }

    scaleGroup(group, sx, sy, sz) {
        return this.transformGroup(group, 'scale', sx, sy, sz)
    }

    rotateGroupX(group, angle) {
        return this.transformGroup(group, 'rotateX', angle)
    }

    rotateGroupY(group, angle) {
        return this.transformGroup(group, 'rotateY', angle)
    }

    rotateGroupZ(group, angle) {
        return this.transformGroup(group, 'rotateZ', angle)
    }
}