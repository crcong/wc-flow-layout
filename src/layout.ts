export function minIndex(arr: number[]) {
  let ii = 0
  for (let i = 0; i < arr.length; i++) ii = arr[ii] <= arr[i] ? ii : i
  return ii
}

export type Props = {
  cols: number
  'gap-x': number
  'gap-y': number
}

type RenderOptions<T> = {
  // w
  getW(el: T): number
  setW(el: T, v: number): void
  // h
  getH(el: T): number
  setH(el: T, v: number): void
  // padding
  getPad(el: T): [number, number, number, number]
  // xy
  setX(el: T, v: number): void
  setY(el: T, v: number): void
  // children
  getChildren(el: T): { [index: number]: T, readonly length: number }
}

export function waterfall_layout<T>(container: T, { getW, setW, getH, setH, getPad, setX, setY, getChildren }: RenderOptions<T>, props: Props) {
  const { cols } = props;
  const gapX = props["gap-x"]
  const gapY =  props["gap-y"]
  const [pt, pr, pb, pl] = getPad(container)
  const children = getChildren(container), len = children.length

  if (len) {
    // 设置 item 宽度
    const w = (getW(container) - gapX * (cols - 1) - (pl + pr)) / cols
    Array.prototype.forEach.call(children, el => setW(el, w))

    // 获取 item 高度
    const hs = Array.prototype.map.call(children, el => getH(el)) as number[]

    // 计算位置
    const stack = Array(cols).fill(pt)

    for (let i = 0; i < len; i++) {
      const el = children[i]
      const col = minIndex(stack)
      setY(el, stack[col])
      setX(el, pl + (w + gapX) * col)
      stack[col] += hs[i] + gapY
    }

    // 设置容器高度
    setH(container, Math.max(...stack) - gapY + pb)
  } else {
    setH(container, pt + pb)
  }
}
