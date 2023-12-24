interface attrStrucutre {
  value: any;
  parent: object;
  key: string;
}
interface structuredObservation {
  set: (this: attrStrucutre, value: any) => any;
  get: (this: attrStrucutre) => any;
}
interface structuredObject {
  [x: string]: structuredObservation;
}
export function convertWrite(
  properties: IAny,
  options: IAny,
  redirect?: string | ('get' | 'set')[]
) {
  /* 
        Returns a modified object for each option added and maybe a redirect. Useful for coverting properties to utilization in Object.defineProperties(obj, <return>)
    */

  const obj: IAny = {};
  for (let prop of Object.keys(properties)) {
    obj[prop] = {};
    for (let [k, v] of Object.entries(options)) {
      obj[prop][k] = v;
      if (redirect) {
        if (Array.isArray(redirect)) {
          for (let r of redirect) {
            if (r === 'get' || r === 'set') {
              obj[prop][k] = v.bind({
                value: properties[prop],
                parent: properties,
                key: prop,
              });
            }
          }
        } else {
          obj[prop][redirect] = properties[prop];
        }
      }
    }
  }
  return obj;
}
export function editWrite(properties: IAny, shallow: object) {
  for (let prop of Object.keys(properties)) {
    Object.getOwnPropertyDescriptor(shallow, prop)?.set?.(properties[prop]);
  }
}
export function createAndAdd(tag: string, attrs: IAny, root: Element) {
  const { tagName, ...rest } = attrs;
  const el = document.createElement(tag);
  Object.assign(el, rest);
  return root.appendChild(el);
}
interface IAny {
  [x: string]: any;
}
interface IStr {
  [x: string]: string;
}
export function createBoxes(root: Element, boxes: number, id = true) {
  let container = root.querySelector('.container');
  if (!container) {
    container = createAndAdd(
      'div',
      {
        className: 'container',
      },
      root
    );
  }
  const elements: HTMLDivElement[] = [];
  for (let i = 0; i < boxes; i++) {
    const options: IAny = {
      className: 'box',
    };
    if (id) {
      options['id'] = `box-${i}`;
    }
    const box = createAndAdd('div', options, container) as HTMLDivElement;
    elements.push(box);
  }
  elements.forEach((node, i) => {
    node.style.height = (100 / boxes) * 0.75 + '%';
    document.documentElement.style.setProperty(
      '--size',
      node.offsetHeight + 'px'
    );
  });
  return elements;
}
export function moveBox(box: HTMLDivElement, progress: number) {
  box.style.transform = `translateX(${progress * 100}%)`;
}
export function createElement(props: IAny): HTMLElement {
  const { tagName, ...rest } = props;
  const el = document.createElement(tagName);
  Object.assign(el, rest);
  return el;
}
export function Array_hasNestedObject(arr: any[]) {
  // Recorre cada elemento del array
  for (let i = 0; i < arr.length; i++) {
    // Si el elemento es un objeto
    if (typeof arr[i] === 'object' && arr[i] !== null) {
      // Devuelve true
      return true;
    }
  }
  // Si no se encontró ningún objeto, devuelve false
  return false;
}
export function Object_hasNestedObject(obj: IAny) {
  // Recorre cada elemento del object.values
  for (let x of Object.values(obj)) {
    // Si el elemento es un objeto
    if (typeof x === 'object') {
      // Devuelve true
      return true;
    }
  }
  // Si no se encontró ningún objeto, devuelve false
  return false;
}
export function structuredObserve(
  original: IAny,
  attrs: {
    set: (this: attrStrucutre, value: any) => any;
    get: (this: attrStrucutre) => any;
  }
) {
  if (!attrs.get) {
    attrs.get = function (this: attrStrucutre) {
      return this.value;
    };
  }

  function getToConvert(obj) {
    return convertWrite(
      obj,
      {
        get: attrs.get,
        set: attrs.set,
      },
      ['get', 'set']
    ) as structuredObject;
  }
  // Nested Til represents the amount of nesting of a object?-/array/object...
  function getIntoExtract(nOriginal: IAny) {
    let nestedTil = Object.keys(nOriginal).length;
    for (let i = 0; i < nestedTil; i++) {
      if (Object_hasNestedObject(nOriginal)) {
        for (let item of Object.values(nOriginal)) {
          getIntoExtract(item as IAny);
        }
      } else if (Array.isArray(nOriginal) && Array_hasNestedObject(nOriginal)) {
        for (let item of nOriginal) {
          getIntoExtract(item);
        }
      } else if (typeof nOriginal === 'object') {
        let nextw: IAny = getToConvert(nOriginal);
        Object.defineProperties(nOriginal, nextw as PropertyDescriptorMap);
      }
      
    }
  }
  getIntoExtract(original);
  Object.defineProperties(original, getToConvert(original) as PropertyDescriptorMap);
}
export function createDOMTree(root: Element, props: IAny) {
  structuredObserve(props, {
    set(value) {
      console.log(value);
    },
    get() {
      return this.value;
    },
  });
  const { children, ...rest } = props;
  const base = root
    ? createAndAdd(rest.tagName, rest, root)
    : createElement(rest);
  for (let child of children) {
    createAndAdd(child.tagName, child, base);
    if (child.children) {
      createDOMTree(base, child);
    }
  }
  return base;
}
export function createUI(root: Element) {
  const tree = createDOMTree(root, {
    tagName: 'div',
    className: 'title',
    children: [
      {
        tagName: 'h1',
        textContent: 'Bezier Easing',
      },
      {
        tagName: 'h2',
        textContent: '()',
      },
      {
        tagName: 'p',
      },
    ],
  });
  console.log(tree);
}
