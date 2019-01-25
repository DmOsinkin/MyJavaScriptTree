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
            'child#' + (this.childs.length + 1),
            this.childs.length + 1,
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
                    this.parentNode.childs.splice(i, i);
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
     * Задать новый текст для узла
     */
    setData(data) {
        this.text = data;
        this.span.innerHTML = this.text + ' (child of #' + this.dataParentId + ')';
    }
}

//создаём корень дерева
let tree = new Node('root', 1, 'root');
//добавляем его на страницу
document.querySelector('#root-ul').appendChild(tree.domElement);
