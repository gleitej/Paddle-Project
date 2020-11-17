import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';
// utils
import setAuthToken from './utils/setAuthToken';
// Components
// Layout
import Test from './components/test/Test';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { loadUser } from './actions/auth';
// Pages
import AddRiverSection from './components/addRiverSection/AddRiverSection';
import CreateProfile from './components/createUpdateProfile/CreateProfile';
import UpdateProfile from './components/createUpdateProfile/UpdateProfile';
import Dashboard from './components/dashboard/Dashboard';
import Paddlers from './components/paddlers/Paddlers';
import Post from './components/post/Post';
import Posts from './components/posts/Posts';
import Rivers from './components/rivers/Rivers';
import CreateProfilePhotoUpload from './components/createUpdateProfile/CreateProfilePhotoUpload';
import MultiPhotoUpload from './components/addRiverSection/MultiPhotoUpload';
import UpdateInfo from './components/addRiverSection/UpdateInfo';
import UpdatePhotos from './components/addRiverSection/UpdatePhotos';
import RiverItem from './components/rivers/RiverItem';
import CreateRiverMap from './components/googleMaps/CreateRiverMap';
import EditMap from './components/addRiverSection/editGmap/EditMap';
import ConfirmEmail from './components/emailAuth/ConfirmEmail';
import ConfirmEmailMessage from './components/emailAuth/ConfirmEmailMessage';
import ForgotPassword from './components/emailAuth/ForgotPassword';
import ResetPassword from './components/emailAuth/ResetPassword';
import About from './components/about/About';

// import Container from './components/gMapsTesting/Container';
import CreateMap from './components/addRiverSection/newGmap/CreateMap';
import RiverIcon from './assets/RiverIcon';
import AdminApplication from './components/adminApplication/AdminApplication';

// mater admin pages
import MasterAdmin from './components/masterAdmin/MasterAdmin';

// protected routing auth components
import LandingPageRedirect from './components/routing/LandingPageRedirect';
import AdminRoute from './components/routing/AdminRoute';
import PendingRoute from './components/routing/PendingRoute';
import MasteradminRoute from './components/routing/MasteradminRoute';
import UserAdminMasteradminRoute from './components/routing/UserAdminMasteradminRoute';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* redirect accordingly */}
          <LandingPageRedirect exact path='/' component={Landing} />

          {/* guest */}
          <Route exact path='/rivers' component={Rivers} />
          <Route exact path='/posts' component={Posts} />

          {/* pending */}
          {/* user */}
          {/* admin */}
          <AdminRoute exact path='/create-map/:id' component={CreateMap} />
          <AdminRoute exact path='/edit-map/:id' component={EditMap} />

          {/* master admin */}
          <Route exact path='/master-admin/dashboard' component={MasterAdmin} />

          <section className='container '>
            <Alert />
            {/* guest */}
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/posts/:id' component={Post} />
            <Route exact path='/rivers/:id' component={RiverItem} />
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/reset/:token' component={ResetPassword} />
            <Route exact path='/about' component={About} />
            {/* pending */}
            <Route
              exact
              path='/confirm-email/:userid/:keyid'
              component={ConfirmEmail}
            />
            <PendingRoute
              exact
              path='/confirm-email'
              component={ConfirmEmailMessage}
            />
            {/* user */}
            <UserAdminMasteradminRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <UserAdminMasteradminRoute
              exact
              path='/update-profile'
              component={UpdateProfile}
            />
            <UserAdminMasteradminRoute
              exact
              path='/dashboard'
              component={Dashboard}
            />
            <UserAdminMasteradminRoute
              exact
              path='/admin/application'
              component={AdminApplication}
            />
            <UserAdminMasteradminRoute
              exact
              path='/single-file-upload-new'
              component={CreateProfilePhotoUpload}
            />
            {/* admin */}
            <AdminRoute
              exact
              path='/add-river-section'
              component={AddRiverSection}
            />
            <AdminRoute
              exact
              path='/add-river-photos/:id'
              component={MultiPhotoUpload}
            />
            <AdminRoute
              exact
              path='/add-river-map'
              component={CreateRiverMap}
            />
            <AdminRoute exact path='/update-river/:id' component={UpdateInfo} />
            <AdminRoute
              exact
              path='/update-photos/:id'
              component={UpdatePhotos}
            />

            {/* master admin */}
            <MasteradminRoute exact path='/test' component={Test} />

            <MasteradminRoute exact path='/paddlers' component={Paddlers} />

            <MasteradminRoute exact path='/icon' component={RiverIcon} />
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
