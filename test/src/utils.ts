export function convertWrite(
  properties: IAny,
  options: IAny,
  redirect?: string
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
        obj[prop][redirect] = properties[prop];
      }
    }
  }
  return obj;
}
export function editWrite(properties: IAny,
  shallow: object) {
    for (let prop of Object.keys(properties)) {
        Object.getOwnPropertyDescriptor(shallow, prop)?.set?.(properties[prop]);
        debugger;
        console.log(Object.getOwnPropertyDescriptor(shallow, prop));
    }
}
export function createAndAdd(tag: string, attrs: IStr, root: Element) {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
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
    node.style.height = (100 / boxes) * 0.75 + "%";
    document.documentElement.style.setProperty(
      '--size',
      node.offsetHeight + 'px'
    );
  });
  return elements;
}