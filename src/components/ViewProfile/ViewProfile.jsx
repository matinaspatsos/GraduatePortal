import React, { Component } from "react";
import { Button } from "react-bootstrap";

import { Media } from "react-bootstrap";

import "./ViewProfile.css";
import Loading from "../Widgets/Loading";
import ErrorMessage from "../Widgets/ErrorMessage";
import noPic from "../../images/no-profile.svg"; //if no profile picture use this default pic

class ViewProfile extends Component {
  state = {
    graduateId: this.props.match.params.graduateId,
    profileData: null,
    isAdmin: false
  };

  addDefaultSrc(e) {
    e.target.src = noPic;
  }

  componentDidMount() {
    if (!this.props.profiles)
      this.props.fetchAllProfiles().then(() => {
        this.setState({
          profileData: Object.values(this.props.profiles).filter(profile => {
            return profile.id === parseInt(this.state.graduateId);
          })
        });
      });
  }

  render() {
    console.log(this.state.profileData);
    console.log(this.props);
    return (
      <div className="ProfileDirectory">
        <main className="">
          <div className="ProfileDirectory-profiles">
            {this.state.isLoading && <Loading />}
            {this.state.hasError && (
              <ErrorMessage>
                Sorry! The Graduate Portal is temporarily down. Our engineers
                are aware of the problem and are hard at work trying to fix it.
                Please come back later.
              </ErrorMessage>
            )}
            {this.state.profileData &&
              Object.values(this.state.profileData).map(graduate => {
                const key = "graduate-" + graduate.id;
                return (
                  <div className="card" key={key}>
                    <Media>
                      <Media.Left>
                        {graduate.image ? (
                          <img
                            className="profile-thumbnail"
                            width={100}
                            src={graduate.image}
                            alt=""
                            onError={this.addDefaultSrc}
                          />
                        ) : (
                          <img
                            className="profile-thumbnail"
                            width={100}
                            src={noPic}
                            alt=""
                          />
                        )}
                      </Media.Left>
                      <Media.Body>
                        <Media.Heading>
                          <p>{graduate.firstName + " " + graduate.lastName} </p>
                        </Media.Heading>
                        <p>{graduate.yearOfGrad}</p>
                        <p>{graduate.skills.join(", ")}</p>
                        <p>{graduate.story}</p>

                        {graduate.links &&
                          Object.entries(graduate.links).map(profileLinks => {
                            const [linkKey, linkVal] = profileLinks;
                            console.log(linkKey, linkVal);
                            const icons = {
                              linkedin: "fab fa-linkedin-in",
                              github: "fab fa-github",
                              website: "fas fa-globe",
                              email: "fas fa-envelope"
                            };
                            // test to see if its truthy
                            if (graduate.links[linkKey])
                              return (
                                <span className="" key={linkKey}>
                                  <a
                                    href={
                                      graduate.links[linkKey] ===
                                      graduate.links.email
                                        ? `mailto:${graduate.links.email}`
                                        : graduate.links[linkKey]
                                    }
                                    target={"_blank"}
                                  >
                                    <i className={`${icons[linkKey]} fa-lg`} />
                                  </a>
                                </span>
                              );
                          })}

                        {graduate.resume && (
                          <Button
                            bsStyle="primary"
                            bsSize="small"
                            href={graduate.resume}
                          >
                            <span>
                              <i className="fas fa-eye" />
                            </span>
                            View Resume
                          </Button>
                        )}

                        {this.state.isAdmin && (
                          <Button bsStyle="primary" bsSize="small">
                            Edit Profile
                          </Button>
                        )}
                      </Media.Body>
                    </Media>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    );
  }
}

export default ViewProfile;
