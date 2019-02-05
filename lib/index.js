class NodeView {
  constructor(text) {
    this.addButtonElement = createElement('button');
    this.deleteButtonElement = createElement('button');
    this.ul = createElement('ul');
    this.li = createElement('li');
    this.span = createElement('span');
    this.input = createElement('input');
    this.input.hidden = true;
    this.parentNode;

    this.addButtonElement.innerHTML = '+';
    this.deleteButtonElement.innerHTML = '-';

    this.span.innerHTML = text;
    this.span.classList.add('node-text');

    li.appendChild(this.span);
    li.appendChild(this.input);
    li.appendChild(this.addButtonElement);
    li.appendChild(this.deleteButtonElement);
    li.appendChild(this.ul);
  }

  createElement(tag) {
    return document.createElement(tag);
  }
}

/**
 * Данный класс представлен как средство управления узлом, а именно его данными
 * (текст, идентификаторы (свой+родительский), массив дочерних узлов) и
 * DOM-элементами узла.
 */
class Node {
  constructor(text, id, parentText = '') {
    //this.view = new NodeView(text);
    this.parentText = parentText;
    this.childs = [];
    this.id = id;
    this.domElement = this.createHTMLNode(text, id, parentText);
    this.setData(text);

    this.addButtonElement.addEventListener('click', () => {
      this.addNodeHandler();
    });
    
    this.deleteButtonElement.addEventListener('click', () => {
      this.deleteNodeHandler();
    });

    this.span.addEventListener('click', () => {
      this.showInputHandler();
    });

    this.input.addEventListener('focusout', () => {
      this.saveNodeHandler();
    });
  }

  /**
   * Добавление дочернего узла
   */
  addNodeHandler() {
    let newNode = new Node(
      `child#${this.childs.length}`,
      this.childs.length,
      this.text
    );
    this.setChild(newNode);
  }

  /**
   * удаление указанного узла
   */
  deleteNodeHandler() {
    if (this.parentNode) {
      this.domElement.remove();
      for (let i = 0; i < this.parentNode.childs.length; i++) {
        if (this.parentNode.childs[i].id == this.id) {
          this.parentNode.childs.splice(i, 1);
        }
      }
    } else {
      alert("Can't delete the root :(");
    }
  }

  /**
   * отображение элемента input для редактирования текста узла
   */
  showInputHandler() {
    this.span.hidden = true;
    this.input.value = this.text;
    this.input.hidden = false;
    this.input.focus();
  }

  /**
   * сохранить изменения узла, скрыть input и отобразить текстовое поле.
   */
  saveNodeHandler() {
    this.setData(this.input.value);
    this.input.hidden = true;
    this.input.value = '';
    this.span.hidden = false;
  }

  /**
   * создать DOM-структуру узла
   */
  createHTMLNode(text, index, parentIndex) {
    this.addButtonElement = document.createElement('button');
    this.deleteButtonElement = document.createElement('button');
    this.span = document.createElement('span');
    this.input = document.createElement('input');
    this.ul = document.createElement('ul');
    let newli = document.createElement('li');child#0

    this.input.hidden = true;

    this.addButtonElement.innerHTML = '+';
    this.deleteButtonElement.innerHTML = '-';child#0

    this.span.innerHTML = this.text;
    this.span.classList.add('node-text');

    newli.appendChild(this.span);
    newli.appendChild(this.input);
    newli.appendChild(this.addButtonElement);
    newli.appendChild(this.deleteButtonElement);
    newli.appendChild(this.ul);
    return newli;
  }

  /**
   * добавить указанный узел в список дочерних узлов.
   */
  setChild(node) {
    this.childs.push(node);
    this.ul.appendChild(node.domElement);
    node.parentNode = this;
  }

  /**
   * Задать новый текст для узла.
   */
  setData(data) {
    this.text = data;

    //у самой верхней ноды нет родительской ноды,
    //поэтому информацию об этом не отображаем
    this.span.innerHTML =
      this.text +
      (this.parentText !== '' ? `(child of ${this.parentText})` : '');

    //меняем информацию о тексте родительской ноды у дочерних узлов.
    this.childs.forEach(child => {
      child.parentText = this.text;
      child.setData(child.text);
    });
  }

  /**
   * Удалить все дочерние узлы.
   */
  clearChilds() {
    this.childs = [];
    while (this.ul.hasChildNodes()) {
      this.ul.removeChild(this.ul.lastChild);
    }
  }
}

function buildTree(jsonTree, parentNode) {
  Object.keys(jsonTree).forEach(function(k) {
    let node = new Node(jsonTree[k].text, k, parentNode.text);
    buildTree(jsonTree[k].childs, node);
    parentNode.setChild(node);
  });
}

/**
 * Рекурсивная функция конвертирования дерева Node в JSON
 */
function convertToJson(node, jsonTree) {
  jsonTree[node.id] = { text: node.text, childs: {} };

  node.childs.forEach(function(childNode) {
    convertToJson(childNode, jsonTree[node.id].childs);
  });
}

document.querySelector('#save-state-btn').addEventListener('click', function() {
  let jsonTree = {};
  convertToJson(tree, jsonTree);
  let str = JSON.stringify(jsonTree);
  localStorage.setItem('tree', str);
});

document.querySelector('#load-state-btn').addEventListener('click', function() {
  let jsonTree = JSON.parse(localStorage.getItem('tree'));
  tree.clearChilds();

  tree = new Node(jsonTree[0].text, jsonTree[0].id);
  buildTree(jsonTree[0].childs, tree);
  document.querySelector('#root-ul').innerHTML = '';
  document.querySelector('#root-ul').appendChild(tree.domElement);
});

//создаём корень дерева
let tree = new Node('root', 0);
//добавляем его на страницу
document.querySelector('#root-ul').appendChild(tree.domElement);

