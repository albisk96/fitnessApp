import React, { Fragment, useState, useEffect } from 'react';
import ProfileForm from '../profile-form/create-profile.component';
import { connect } from 'react-redux';
import Education from './education-and-achievements/education.component';
import Achievements from './education-and-achievements/achievements.component';
import Information from './information/information.component';
import WorkoutList from '../../components/workouts/profile-workout.component';
import UpdateEducationForm from '../profile-form/update-education.component';
import UpdateAchievementsForm from '../profile-form/update-achievements.component';
import IconButton from '../icon-button/icon.component';
import ProfileAvatar from './avatar/avatar.component';
import AddWorkout from '../workouts/add-workout.component';
import Comments from './comments/comments.component';
import MySchedule from './schedule/schedule.component';
import Schedule from './schedule/reserve-schedule.component';
import { Button, Tabs, Tab } from 'react-bootstrap'
import { fetchWorkoutData } from '../../redux/workouts/workouts.action'
import { Center, ProfileInfoContainer, Line, PortfolioContainer, StyledWrap, FormBackground, JumboContainer } from './profile.styles.jsx'
import { useAuth } from '../../contexts';
import Spinner from '../spinner/spinner.component';
import TableReservations from '../users-table/individual-members-table.components'


const Profile = ({ profile: { profile }, workout: {workouts} }) => {
    
    const { session } = useAuth();
    const [more, setMore] = useState(true);
    const [key, setKey] = useState('profile');
    // const me = workouts.filter(x => x.user === session.id)
    // const coach = workouts.filter(x => x.user === profile.user._id)
    // const myClosed = me.filter(x => new Date(x.when) - new Date < 0)
    // const myOpen = me.filter(x => new Date(x.when) - new Date > 0)
    // const coachOpen = coach.filter(x => new Date(x.when) - new Date > 0)
    const handleClick = () => setMore(!more);
    return(
        <div>
            { profile ?  
                <JumboContainer>
            <div>
                <ProfileAvatar profile={profile} />
            </div>
            <div className="container">
            <ProfileInfoContainer>
            <Tabs 
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="profile" title="Profile">
                { !profile ? <Spinner /> : profile.user._id === session.id ? 
                    <Fragment>
                    <Center style={{marginBottom: "2%"}}>
                    <p>Update your portfolio</p>
                    </Center>
                    <PortfolioContainer>
                        <IconButton modalTitle="Update Education" iconName="fas fa-graduation-cap" componentInModal={<UpdateEducationForm education={profile.education} />} />
                        <IconButton modalTitle="Update Achievements" iconName="fas fa-trophy" componentInModal={<UpdateAchievementsForm achievements={profile.achievements} />} />
                    </PortfolioContainer>      
                    <Line />    
                    </Fragment>
                    : '' }
                    <Center>
                        <Information profile={profile} />
                    </Center>
                    <Center style={{ marginBottom: '5%', marginTop: '5%'}}>
                        <h3>Education</h3>
                        <Line />
                    </Center>
                    { profile.education && profile.education !== null ? <Education education={profile.education} /> : <center>You need to update your education profile</center>}
                    <Center style={{ marginBottom: '5%', marginTop: '5%'}}>
                        <h3>Achievements</h3>
                        <Line />
                    </Center>
                    { profile.achievements !== null ? <Achievements achievements={profile.achievements} /> : <center>You need to update your achievements profile</center>}
                    <Center style={{ marginBottom: '5%', marginTop: '5%'}}>
                        <h3>Workouts</h3>
                        <Line />
                        { profile.user._id === session.id ? 
                            <Fragment>
                                <AddWorkout className="btn btn-outline-danger my-2 my-sm-0" modalTitle="Create a workout" buttonName="Add New" />
                                <WorkoutList workouts=
                                {more ? workouts.filter(x => x.user._id === session.id && new Date(x.when) - new Date > 0).slice(0, 3) 
                                : workouts.filter(x => x.user._id === session.id && new Date(x.when) - new Date > 0) } />
                            </Fragment>
                            : <WorkoutList workouts=
                            {more ?  workouts.filter(x => x.user._id === profile.user._id && new Date(x.when) - new Date > 0).slice(0, 3) 
                            : workouts.filter(x => x.user._id === profile.user._id && new Date(x.when) - new Date > 0) }/>
                        }
                        <Button onClick={handleClick} variant="outline-dark">{!more ? 'Show less' : 'Show All'}</Button>
                    </Center>
                </Tab>
                <Tab eventKey="Reviews" title="Reviews">
                    <Comments profile={profile} id={session.id} />
                </Tab>
                { !profile ? <Spinner /> : profile.user._id === session.id ? 
                    <Tab eventKey="Archive" title="Archive Workouts">
                    <WorkoutList workouts={workouts.filter(x => x.user._id === session.id && new Date(x.when) - new Date < 0) } />
                    </Tab> : ''
                }
                { !profile ? <Spinner /> : profile.user._id === session.id ? 
                    <Tab eventKey="MySchedule" title="My Schedule">
                    <MySchedule />
                    </Tab> : ''
                }
                { !profile ? <Spinner /> : profile.user._id === session.id ? 
                    <Tab eventKey="Individual" title="Workouts Schedule">
                    <TableReservations workouts={workouts.filter(x => new Date(x.when) - new Date > 0 && !x.group)} />
                    </Tab> : ''
                }
            </Tabs>
                </ProfileInfoContainer>
            </div>
            </JumboContainer> : 
            <FormBackground>
                <div className="container" style={{ marginTop: '1%'}}>
                    <Center>
                        <h1 style={{ color: 'white'}}>Please, create your Coach profile!</h1>
                    </Center>
                <ProfileForm />
                </div>
            </FormBackground>
        }
        </div>
    )
}

const mapStateToProps = state => ({
    profile: state.profile,
    workout: state.workout
});

export default connect(mapStateToProps, {fetchWorkoutData})(Profile);