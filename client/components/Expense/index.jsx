import React, { Component } from 'react'

import Header from './Header'
import Table from './Table'

export class index extends Component {
  render () {
    return (
      <div className="expense">
        <Header />
        <Table />
      </div>
    )
  }
}

export default index
