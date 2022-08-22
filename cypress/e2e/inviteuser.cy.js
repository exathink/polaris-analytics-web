/// <reference types="cypress" />


import { first, last } from "lodash";
import {ACCOUNT, ORGANIZATION, USER, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getMutationFullName, getQueryFullName} from "../support/utils";

var email = "priya_mukundan@yahoo.com"
var firstname = "Elizabeth"
var lastname =  "Bennett"



describe("Invite User flow", () => {
  beforeEach(() => {




    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");
    Cypress.Cookies.preserveOnce("session"); 

/*     cy.interceptQuery({operationName: viewer_info, fixturePath: `${viewer_info}.json`});
    cy.interceptQuery({
      operationName: ORGANIZATION.with_organization_instance,
      fixturePath: `${ORGANIZATION.with_organization_instance}.json`,
    }); */

    cy.interceptQuery({
      operationName: ACCOUNT.accountUsers,
      fixturePath: 'accountUsers.json'
    });


  });



  it('should invite a user', () => {



     
    cy.interceptMutation({operationName: USER.inviteUser, 
      fixturePath: 'inviteUser_success.json'
    })

    cy.visit('/app/admin/account');
    // cy.wait([`@${getQueryFullName(viewer_info)}`, `@${getQueryFullName(ORGANIZATION.with_organization_instance)}`]);
    cy.wait(`@${getQueryFullName(ACCOUNT.accountUsers)}`);


    cy.getBySel("create-connector-button").click();
    cy.get("input#email").type(email).should("have.value", email);
    cy.get("input#firstName").type(firstname).should("have.value", firstname);
    cy.get("input#lastName").type(lastname).should("have.value", lastname);

    cy.contains(/^Invite$/).click();

  });
   

  it('fails to invite a user', () => {

    cy.interceptMutation({operationName: USER.inviteUser, 
      fixturePath: `inviteUser_failure.json`
    });


    cy.visit('/app/admin/account');

    cy.wait(`@${getQueryFullName(ACCOUNT.accountUsers)}`);

    cy.getBySel("create-connector-button").click();
    cy.get("input#email").type(email).should("have.value", email);
    cy.get("input#firstName").type(firstname).should("have.value", firstname);
    cy.get("input#lastName").type(lastname).should("have.value", lastname);

    cy.contains(/^Invite$/).click();

  });


    
});



