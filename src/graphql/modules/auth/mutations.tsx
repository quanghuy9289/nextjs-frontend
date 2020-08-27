import gql from 'graphql-tag';

export const AuthenticateMutation = gql`    
mutation login($input:LoginInput!
    ){
      login(input:$input) {
        token,
        user {
          id,
          email,
          fullname,
          nickname,
          phoneNumber
        }
      }
    }
`;