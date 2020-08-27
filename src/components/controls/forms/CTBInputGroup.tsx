import { useState } from 'react';
import { InputGroup, Intent, FormGroup } from "@blueprintjs/core";

const CTBInputGroup = (props) => {
    let { value, onChange, controlId,labelInfo, required, ...inputProps } = props;
    let [inputStatus, setInputStatus] = useState({helpText:"", intent: ""});
    
    labelInfo = labelInfo || (required ? "(required)" : "")

    return (
        <FormGroup
            {...inputProps}
            helperText={inputStatus.helpText}
            labelFor={controlId}
            labelInfo={labelInfo}
            intent={inputStatus.intent}>
            <InputGroup id={controlId} intent={inputStatus.intent} value={value} {...inputProps} onChange={(event) => {
                onChange && onChange(event);
                
                if(required) {
                    if(!event.target.value) {
                        setInputStatus({helpText: "This field is required", intent:Intent.DANGER});
                    } else {
                        setInputStatus({helpText: "", intent:Intent.NONE});
                    }
                }
                
            }}></InputGroup>
        </FormGroup>
    )
};

export default CTBInputGroup;