import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { readEvents } from '../actions'
import { Link } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

class EventsIndex extends Component {
    componentDidMount() {
        this.props.readEvents()
    }
    
    renderEvents() {
        return _.map(this.props.events, event =>(
            <StyledTableRow key={event.id}>
              <StyledTableCell align="center">{event.id}</StyledTableCell>
              <StyledTableCell align="center">
                  <Link to={`/events/${event.id}`}>
                        {event.title}
                    </Link>
                </StyledTableCell>
              <StyledTableCell align="center"> {event.body}</StyledTableCell>
            </StyledTableRow>
        ))
    }

    render() {
        const style = {
            position: 'fixed',
            right: 12,
            buttom: 12
        }
        return (
            <React.Fragment>
                 <TableContainer component={Paper}>
                 <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">ID</StyledTableCell>
                            <StyledTableCell align="center">Title</StyledTableCell>
                            <StyledTableCell align="center">Body</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.renderEvents() }
                        </TableBody>
                    </Table>
                    </TableContainer>
                <Fab style = {style} color="secondary" aria-label="add" href="/events/new"><AddIcon /></Fab>
            </React.Fragment>
        )
    }
}

const matStateToProps = state => ({ events: state.events })

const mapDispachToProps = ({ readEvents })

export default connect(matStateToProps, mapDispachToProps)(EventsIndex)

