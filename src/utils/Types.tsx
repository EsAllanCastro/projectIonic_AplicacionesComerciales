export type DishInOrder = Dish & {
  amount: number
}

export type Dish= {
  id: number
  name: any
  price: any
  description: any
  photography: any
}

export type Client= {
  id: number
  firstname: string
  lastname: string
  direction: string
}
