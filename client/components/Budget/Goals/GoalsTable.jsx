import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Fade from 'react-reveal/Fade'
import { selectUserGoal } from '../../../store/actions/goals'
import { getWeeklyContribution } from './tableHelper'
import { addCommas } from '../../helpers'
class GoalsTable extends Component {
  handleClick = (goal) => () => {
    this.props.selectUserGoal(goal)
  }

  getRemaining = (end, type) => {
    const date1 = new Date(end)
    const date2 = Date.now()
    const diffTime = date1 - date2

    let remaining = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (type === 'string') {
      if (remaining > 1) {
        remaining = addCommas(remaining, true)
        return `${remaining} days`
      } else if (remaining <= 0) {
        return `completed!`
      }
      return remaining
    }
    return remaining
  }

  getDailyContribution = (amount, frequency) => {
    switch (frequency) {
      case 'Weekly':
        return amount / 7
      case 'Monthly':
        return amount * 12 / (52 * 7)
      case 'Annually':
        return amount / (52 * 7)
    }
  }
  getWeeklyContribution = (amount, frequency) => {
    switch (frequency) {
      case 'Monthly':
        return amount * 12 / 52
      case 'Annually':
        return amount / 52
      default:
        return amount
    }
  }
  getActualDate = (amountAdded, frequency, targetBudget, currentAmount) => {
    // calculate days left

    const daysLeft = ((targetBudget - currentAmount) / this.getDailyContribution(amountAdded, frequency))

    const millisecondsLeft = daysLeft * 24 * 60 * 60 * 1000

    // calculate date of completion (current date + days left = date of completion)
    const currentDate = Date.now()
    const completionDate = new Date(Number(currentDate) + Number(millisecondsLeft))

    const formatedDate = completionDate.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })

    return formatedDate
  }
  formatDate = (date, type) => {
    if (type === 'chosen') {
      const segments = date.split('-')
      return `${segments[2]}/${segments[1]}/${segments[0]}`
    }
    if (type === 'actual') {
      const segments = date.split('/')
      return `${segments[1]}/${segments[0]}/${segments[2]}`
    }
  }
  render () {
    return (
      <Fade>
        <Table inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Goal Name</Table.HeaderCell>
              <Table.HeaderCell>Target Budget</Table.HeaderCell>
              <Table.HeaderCell>Current Amount</Table.HeaderCell>
              <Table.HeaderCell>Actual Date of Completion</Table.HeaderCell>
              <Table.HeaderCell>Actual Time Remaining</Table.HeaderCell>
              <Table.HeaderCell>Actual Weekly Contributions</Table.HeaderCell>
              <Table.HeaderCell className="goalsTableSpecial">Your Chosen Date of Completion</Table.HeaderCell>
              <Table.HeaderCell className="goalsTableSpecial">Calculated Weekly Contributions</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.goals.map((goal) => {
                return <Table.Row className='pointerCursor' key={goal.id} onClick = {this.handleClick(goal)} active={this.props.selected && goal.id === this.props.selected.id}>
                  <Table.Cell>{goal.goalName}</Table.Cell>
                  <Table.Cell>{addCommas(goal.targetBudget)}</Table.Cell>
                  <Table.Cell>{addCommas(goal.currentAmount)}</Table.Cell>
                  <Table.Cell>{`${this.formatDate(this.getActualDate(goal.budgetDistribution, goal.frequency, goal.targetBudget, goal.currentAmount), 'actual')}`}</Table.Cell>
                  <Table.Cell>{this.getRemaining(this.getActualDate(goal.budgetDistribution, goal.frequency, goal.targetBudget, goal.currentAmount), 'string')}</Table.Cell>
                  <Table.Cell>{addCommas(this.getWeeklyContribution(goal.budgetDistribution, goal.frequency).toFixed(2))}</Table.Cell>
                  <Table.Cell className="goalsTableSpecial">{this.formatDate(goal.targetDate, 'chosen')}</Table.Cell>
                  <Table.Cell className="goalsTableSpecial">{addCommas(getWeeklyContribution(this.getRemaining(goal.targetDate), goal.currentAmount, goal.targetBudget))}</Table.Cell>
                  <Table.Cell>{goal.active ? 'Yes' : 'No'}</Table.Cell>
                </Table.Row>
              })
            }
          </Table.Body>
        </Table>
      </Fade>
    )
  }
}

const mapStateToProps = (state) => ({
  goals: state.goal.all,
  selected: state.goal.selected,
  userId: state.auth.user.id
})

const mapDispatchToProps = {
  selectUserGoal
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalsTable)
