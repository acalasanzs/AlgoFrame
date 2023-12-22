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
              let modifier: IAny = {};
              modifier[redirect] = v.bind(properties[prop]);
              Object.defineProperty(obj, prop, modifier);
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
export function createDOMTree(root: Element, props: IAny) {
  const next = convertWrite(
    props,
    {
      set(value) {
        console.log(value);
      },
      get() {
        return "a";
      },
    },["get","set"]
  );
  Object.defineProperties(props, next as PropertyDescriptorMap);
  props.tagName = "div";
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
