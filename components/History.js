import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry, selectDate } from "../actions";
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import { Agenda as UdaciFitnessCalendar } from "react-native-calendars"
import { white } from '../utils/colors'
import MetricCard from "./MetricCard"
import { AppLoading } from "expo"


class History extends Component {
    state = {
        ready: false,
        selectedDate: new Date().toISOString().slice(0, 10),
    }
    componentDidMount() {
        const { dispatch } = this.props;
        // if there is no entry today, we add this info as a property
        // on our state under the key today
        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if (!entries[timeToString()]) {
                    dispatch(
                        addEntry({
                            [timeToString()]: getDailyReminderValue(),
                        })
                    );
                }
            })
            .then(() =>
                this.setState(() => ({
                    ready: true,
                }))
            );
    }
    renderItem = (dateKey, { today, ...metrics }) => (
        <View style={styles.item}>
            {today
                ? (<View>
                    <Text>{today}</Text>
                </View>)
                : (<TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate("EntryDetail", { entryId: dateKey })
                    }
                >
                    <MetricCard metrics={metrics} />
                </TouchableOpacity>)}
        </View>
    )

    onDayPress = (day) => {

        this.setState({
            selectedDate: day.dateString,
        });
    };

    renderEmptyDate(formattedDate) {
        return (
            <View style={styles.item}>
                <Text>You didn't log any data on this day</Text>
            </View>
        )
    }
    render() {
        const { entries } = this.props
        const { ready, selectedDate } = this.state

        if (ready === false) {
            return <AppLoading />
        }

        return (
            <UdaciFitnessCalendar
                style={{ height: 300 }}
                items={entries}
                onDayChange={this.onDayPress}
                onDayPress={this.onDayPress}
                renderItem={(item, firstItemInDay) =>
                    this.renderItem(selectedDate, item)
                }
                renderEmptyDate={this.renderEmptyDate}
            />
        )
    }
}
const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === "ios" ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 25,
        justifyContent: "center",
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: "rgba(0, 0, 0, 0.24)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    noDataText: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
})
function mapStateToProps(entries) {
    return {
        entries
    }
}
export default connect(
    mapStateToProps,
)(History)