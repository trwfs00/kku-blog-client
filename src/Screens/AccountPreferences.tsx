import React, { useContext, useEffect, useState } from "react";
import "../misc/AccountPreferences.css";
import Navbar1 from "../Navbar/Navbar1";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ChangePasswordModal from "./ChangePassword-modal";
import ChangeEmailModal from "./ChangeEmailModal";
import DeleteAccountModal from "./DeleteAccount-confirm";
import { Button } from "react-bootstrap";
import AnimationWrapper from "./page-animation";
import { removeFromSession } from "../common/session";
import { UserContext } from "../App";

const AccountPreferences: React.FC = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);
  const [isOn, setIsOn] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    show_notifications: true,
    google_auth: false,
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newNotificationSetting, setNewNotificationSetting] =
    useState<boolean>(true);
  const API_BASE_URL = "http://localhost:3001";
  const userId = sessionStorage.getItem("userId");

  const toggleSwitch = () => {
    setNewNotificationSetting((prev) => !prev);
  };

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  const handleSaveNotificationSettings = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/profile/edit-profile/notifications/${userId}`,
        {
          show_notifications: newNotificationSetting,
        }
      );
      setUserData((prevData) => ({
        ...prevData,
        show_notifications: newNotificationSetting,
      }));
      alert("Notification settings updated successfully");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      alert("Failed to update notification settings");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${API_BASE_URL}/profile/${userId}`);
          setUserData(response.data);
          setIsOn(response.data.show_notifications);
          setNewNotificationSetting(response.data.show_notifications);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveEmail = async (email: string) => {
    try {
      const updatedData = { email };
      await axios.post(
        `${API_BASE_URL}/profile/edit-profile/update/${userId}`,
        updatedData
      );
      setUserData((prevData) => ({ ...prevData, email }));
      setShowEmailModal(false);
      alert("Email updated successfully");
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email.");
    }
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    alert("Your account has been deleted.");
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <AnimationWrapper>
      <div className="account-preferences-container">
        <h1>Account Settings</h1>
        <div className="account-preferences-box">
          <form>
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={userData.email}
                readOnly
                style={userData.email ? { color: "gray" } : { color: "black" }}
              />
              <span
                className="change-link"
                onClick={() => {
                  if (userData.google_auth) {
                    setShowEmailModal(false);
                    alert(
                      "Your profile was created with Google. You cannot change your email!"
                    );
                  } else {
                    setShowEmailModal(true);
                  }
                }}
              >
                Change Email
              </span>
            </div>
            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value="********" readOnly />
              <span
                className="change-link"
                onClick={() => {
                  if (userData.google_auth) {
                    setShowPasswordModal(false);
                    alert(
                      "Your profile was created with Google. You cannot change your password!"
                    );
                  } else {
                    setShowPasswordModal(true);
                  }
                }}
              >
                Change Password
              </span>
            </div>
            <div className="on-offnoti">
              <p>Notifications</p>
              <div
                className={`switch ${newNotificationSetting ? "on" : "off"}`}
                onClick={toggleSwitch}
              >
                <div className="toggle-ball"></div>
                <span className="label">
                  {newNotificationSetting ? "ON" : "OFF"}
                </span>
              </div>
            </div>
            <p
              className="delete-account"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Your Account
            </p>
            <p className="delete-info">
              You will receive an email to confirm your decision. Please note
              that all boards you have created will be permanently erased.
            </p>

            <div className="action-buttons">
              <Button
                variant="secondary"
                type="button"
                className="cancel-button"
                href="/"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="save-button"
                onClick={handleSaveNotificationSettings}
              >
                Save
              </Button>
            </div>
          </form>
        </div>

        {/* Change Email Modal */}
        <ChangeEmailModal
          show={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSave={handleSaveEmail}
          oldEmail={userData.email}
        />

        {/* Change Password Modal */}
        {showPasswordModal && (
          <ChangePasswordModal
            userId={userId}
            show={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

        {/* Delete Account Modal */}
        <DeleteAccountModal
          userId={userId}
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </AnimationWrapper>
  );
};

export default AccountPreferences;
