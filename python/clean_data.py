"""
Clean raw data file for analysis
"""
from datetime import timedelta

import pandas as pd
pd.set_option('mode.chained_assignment', None)


df = pd.read_csv("Datathon - CHA activities 2016-2020.csv", parse_dates=['ActivityDate'], low_memory=False)

# Add some datetime-type columns
df['year'] = df['ActivityDate'].dt.year
df['quarter'] = df['ActivityDate'].dt.quarter
df['month'] = df['ActivityDate'].dt.month
df['year_quarter'] = df['year'].astype(str) + '-' + df['quarter'].astype(str)
df['year_month'] = df['year'].astype(str) + '-' + df['month'].astype(str)
df['week_start'] = df['ActivityDate'].apply(lambda dt: dt - timedelta(days = (dt.weekday() + 1) % 7))


# Set aside referral rows in case they're useful for something later.
referrals_df = df[df['CategoryName'] == 'Service Referrals']
# Drop people counts
referrals_df = referrals_df[~referrals_df['ProgrammeName'].isin({
    'Number of families participating in the Hub', 'Adults', 'Children', 'Participants who gained employment'
})]

referrals_df.to_csv('referrals.csv', index=None)

# Clean programme data - drop records with 0 attendees as these are probably events that didn't run.
clean_df = df[df['CategoryName'] == 'Programmed Activities']
clean_df = clean_df[(clean_df['ChildParticipants'] > 0) | (clean_df['AdultParticipants'] > 0)]

# Drop all columns except these explictly desired ones:
clean_df = clean_df[[
    'HubRandomID', 'Hub_ActivityID', 'ActivityDate', 'year', 'quarter', 'month', 'year_quarter',
    'year_month', 'week_start', 'ProgrammeName', 'ReferralParticipants', 'EngagedCount',
    'ExternalVolunteers', 'HubVolunteers', 'SchoolVolunteers'
]]

clean_df.to_csv('activities.csv', index=None)
