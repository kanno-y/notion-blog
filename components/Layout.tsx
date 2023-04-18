import React, { FC, ReactNode } from 'react'
import { Navbar } from './Navbar/Navbar'

type Props = {
  children: ReactNode
}
export const Layout: FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
