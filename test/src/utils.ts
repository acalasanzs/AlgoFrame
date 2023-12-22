interface attrStrucutre {
  value: any;
  parent: object;
  key: string;
}
export function convertWrite(
  properties: IAny,
  options: IAny,
  redirect?: string,
  proto: boolean = false,
  recursive: boolean = false
) {
  /* 
        Returns a modified object for each option added and maybe a redirect. Useful for coverting properties to utilization in Object.defineProperties(obj, <return>)
    */

  const obj: IAny = {};
  function recursiveAssign(obj: IAny, key: string, value: any) {
    if (Array.isArray(value)) {
      obj[key] = [];
      for (let i = 0; i < value.length; i++) {
        obj[key].push(
          convertWrite(value[i], options, key)
        );
      }
    } else if (
      Array.isArray(value) ||
      typeof value === 'object'
    ) {
      obj[key] = convertWrite(value, options, key);
    }
  }
  for (let prop of Object.keys(properties)) {
    obj[prop] = {};
    for (let [k, v] of Object.entries(options)) {
      obj[prop][k] = v;
      if (proto) {
        if (k === 'get' || k === 'set') {
          if(recursive) {
            recursiveAssign(obj[prop], k, properties[prop])
          }else{
            obj[prop][k] = v.bind({
              value: properties[prop],
              parent: properties,
              key: prop,
            });
          }
        }
          
      }
      if (redirect) {
        if (recursive) {
          recursiveAssign(obj, prop, properties[prop])
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
  const next = convertWrite(
    original,
    {
      get: attrs.get,
      set: attrs.set,
    },
    undefined,
    true,
    true
  );
  Object.defineProperties(original, next as PropertyDescriptorMap);
}
export function createDOMTree(root: Element, props: IAny) {
  const { children, ...rest } = props;
  const base = root
    ? createAndAdd(rest.tagName, rest, root)
    : createElement(rest);
  props.ref = base;
  for (let child of children) {
    child.ref = createAndAdd(child.tagName, child, base);
    if (child.children) {
      createDOMTree(base, child);
    }
  }
  structuredObserve(props, {
    get() {
      return this.value;
    },
    set(value) {
      console.log('a');
      this.value.ref[this.key] = value;
    },
  });
  return base;
}
export function createUI(root: Element) {
  const props = {
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
  };
  const tree = createDOMTree(root, props);
  props.children[0].textContent = 'Ya no';
}
