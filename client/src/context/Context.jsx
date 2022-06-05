import React, { Component, createContext } from 'react';
import ActionType from './GlobalActionContentx';

export const RootContext = createContext();

const Provider = RootContext.Provider;
const GlobalProvider = (Children) => {
    return (
        class ParentComp extends Component{

            state = {
                user : {},
                list_artist : [],
                list_godev : [],
            }

            dispatch = (params) =>{
                if(params.action === ActionType.SET_USER)
                {
                    return this.setState({
                        ...this.state,
                        user : params.data,
                    })
                }
                if(params.action === ActionType.REMOVE_USER)
                {
                    return this.setState({
                        ...this.state,
                        user : {},
                    })
                }
                if(params.action === ActionType.SET_ARTIST)
                {
                    return this.setState({
                        ...this.state,
                        list_artist : params.data
                    })
                }
                if(params.action === ActionType.SET_GODEVS)
                {
                    return this.setState({
                        ...this.state,
                        list_godev : params.data
                    })
                }
            }

            render(){
                return(
                    <Provider value={
                        {
                            state : this.state,
                            dispatch : this.dispatch,
                        }
                    } >
                        <Children {...this.props} />
                    </Provider>
                )
            }

        }
    )
}

export default GlobalProvider;

//Consumer
const Consumer = RootContext.Consumer;
export const GlobalConsumer = (Children) =>{
    return(
        class ParentConsumer extends Component {
            render(){
                return(
                    <Consumer>
                        {
                            value=>{
                                return(
                                    <Children {...this.props} {...value} />
                                )
                            }
                        }
                    </Consumer>
                )
            }
        }
    )
}