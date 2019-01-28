/**
 * Данный класс представлен как средство управления узлом, а именно его данными
 * (текст, идентификаторы (свой+родительский), массив дочерних узлов) и
 * DOM-элементами узла.
 */
class Node {
    constructor(text, dataId, dataParentId) {
        //Идентификатор родительского узла. Используется чисто для вывода
        //информации в узле через метод setData(text).
        this.dataParentId = dataParentId;
        //Массив дочерних узлов.
        this.childs = [];
        //Счетчик дочерних узлов для назначения им идентификаторов.
        this.childsCounter = 0;
        //идентификатор среди соседей узла. Используется в методе deleteHandler().
        this.dataId = dataId;
        //DOM-элемент узла, используется для удаления в deleteHandler() и добавления
        //в #root-ul.
        this.domElement = this.createHTMLNode(text, dataId, dataParentId);
        this.setData(text);
        //вешаем событие на кнопку "+", создающее дочерний узел
        this.addButtonElement.addEventListener('click', this.addHandler.bind(this));
        //вешаем событие на кнопку "-", удаляющее данный узел
        this.deleteButtonElement.addEventListener(
            'click',
            this.deleteHandler.bind(this)
        );
        //вешаем событие на текстовое поле узла, позволяет редактировать текст узла.
        this.span.addEventListener('click', this.updateHandler.bind(this));
        //событие для скрытия элемента input и отображения текстового поля при
        //потери фокуса элементом input/
        this.input.addEventListener('focusout', this.saveNodeHandler.bind(this));
    }

    /**
     * Добавление дочернего узла
     */
    addHandler() {
        let newNode = new Node(
            'child#' + ++this.childsCounter,
            this.childsCounter,
            this.dataId
        );
        this.setChild(newNode);
    }

    /**
     * удаление указанного узла
     */
    deleteHandler() {
        if (this.parentNode) {
            this.domElement.remove();
            for (let i = 0; i < this.parentNode.childs.length; i++) {
                if (this.parentNode.childs[i].dataId == this.dataId) {
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
    updateHandler() {
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
        let newli = document.createElement('li');

        this.input.hidden = true;

        this.addButtonElement.innerHTML = '+';
        this.deleteButtonElement.innerHTML = '-';

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
        this.span.innerHTML = this.text + ' (child of #' + this.dataParentId + ')';
    }

    /**
     * Удалить все дочерние узлы.
     */
    clearChilds() {
        this.childs = [];
        while (this.ul.hasChildNodes()) {
            this.ul.removeChild(this.ul.lastChild);
        }
        this.childsCounter = 0;
    }
}

function buildTree(jsonTree, parentNode) {
    Object.keys(jsonTree).forEach(function (k) {
        let node = new Node(jsonTree[k].text, k, parentNode.dataId);
        buildTree(jsonTree[k].childs, node);
        parentNode.setChild(node);
    });
}

/**
 * Рекурсивная функция конвертирования дерева Node в JSON
 */
function convertToJson(node, jsonTree) {
    let newJsonTree = {};
    jsonTree[node.dataId] = {text: node.text, childs: {}};

    //if (node.childs.length != 0) {
    node.childs.forEach(function (childNode) {
        convertToJson(childNode, jsonTree[node.dataId].childs);
    });
    //}
}

document.querySelector('#save-state-btn').addEventListener('click', function () {
    let jsonTree = {};
    convertToJson(tree, jsonTree);
    let str = JSON.stringify(jsonTree);
    setCookie('tree', str);
});

document.querySelector('#load-state-btn').addEventListener('click', function () {
    let jsonTree = JSON.parse(getCookie('tree'));
    tree.clearChilds();
    buildTree(jsonTree['root'].childs, tree);
});

function getCookie(name) {
    var matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
            name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
            '=([^;]*)'
        )
    );
    console.log(matches);
    return matches ? matches[1] : undefined;
}

function setCookie(name, value, options) {
    var updatedCookie = name + '=' + value;
    document.cookie = updatedCookie;
}

//создаём корень дерева
let tree = new Node('root', 'root', 'main');
//добавляем его на страницу
document.querySelector('#root-ul').appendChild(tree.domElement);
