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
    makeTranslation(x, y, z) {
        this.elements.set([
            1, 0, 0, x,    // x смещение
            0, 1, 0, y,    // y смещение  
            0, 0, 1, z,    // z смещение
            0, 0, 0, 1
        ])
        return this
    }
}