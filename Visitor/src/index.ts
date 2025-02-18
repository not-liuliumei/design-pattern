// 1. 定义 AST 节点类型基类
abstract class ASTNode {
    abstract accept(visitor: Visitor): any;
  }
  
  // 2. 具体节点类型定义
  class NumberLiteral extends ASTNode {
    constructor(public value: number) {
      super();
    }
  
    accept(visitor: Visitor) {
      return visitor.visitNumberLiteral(this);
    }
  }
  
  class StringLiteral extends ASTNode {
    constructor(public value: string) {
      super();
    }
  
    accept(visitor: Visitor) {
      return visitor.visitStringLiteral(this);
    }
  }
  
  class BinaryExpression extends ASTNode {
    constructor(
      public left: ASTNode,
      public operator: string,
      public right: ASTNode
    ) {
      super();
    }
  
    accept(visitor: Visitor) {
      return visitor.visitBinaryExpression(this);
    }
  }
  
  // 3. 访问者接口定义
  interface Visitor {
    visitNumberLiteral(node: NumberLiteral): any;
    visitStringLiteral(node: StringLiteral): any;
    visitBinaryExpression(node: BinaryExpression): any;
  }
  
  // 4. 实现具体访问者 - 类型检查器
  class TypeCheckingVisitor implements Visitor {
    visitNumberLiteral(node: NumberLiteral) {
      return "number";
    }
  
    visitStringLiteral(node: StringLiteral) {
      return "string";
    }
  
    visitBinaryExpression(node: BinaryExpression) {
      const leftType = node.left.accept(this);
      const rightType = node.right.accept(this);
  
      if (leftType !== rightType) {
        throw new Error(
          `Type mismatch: ${leftType} ${node.operator} ${rightType}`
        );
      }
  
      // 这里可以添加更复杂的类型规则检查
      return leftType; // 假设运算符支持相同类型运算
    }
  }
  
  // 5. 使用示例
  // 构建 AST: 1 + "2"（这应该触发类型错误）
  const ast = new BinaryExpression(
    new NumberLiteral(1),
    "+",
    new StringLiteral("2")
  );
  
  // 执行类型检查
  const typeChecker = new TypeCheckingVisitor();
  try {
    ast.accept(typeChecker);
    console.log("Type check passed!");
  } catch (e: unknown) {
    console.error("Type check failed:", e);
  }