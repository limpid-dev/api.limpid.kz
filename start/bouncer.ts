/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
export const { actions } = Bouncer

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({
  ProfilePolicy: () => import('App/Policies/ProfilePolicy'),
  ProfileContactPolicy: () => import('App/Policies/ProfileContactPolicy'),
  EducationPolicy: () => import('App/Policies/EducationPolicy'),
  SkillPolicy: () => import('App/Policies/SkillPolicy'),
  ProfileCertificatePolicy: () => import('App/Policies/ProfileCertificatePolicy'),
  ExperiencePolicy: () => import('App/Policies/ExperiencePolicy'),
  ProjectPolicy: () => import('App/Policies/ProjectPolicy'),
  MembershipPolicy: () => import('App/Policies/MembershipPolicy'),
  UserPolicy: () => import('App/Policies/UserPolicy'),
  CertificateFilePolicy: () => import('App/Policies/CertificateFilePolicy'),
  ProjectFilePolicy: () => import('App/Policies/ProjectFilePolicy'),
  AuctionPolicy: () => import('App/Policies/AuctionPolicy'),
  AuctionFilePolicy: () => import('App/Policies/AuctionFilePolicy'),
  AuctionBidPolicy: () => import('App/Policies/AuctionBidPolicy'),
  TenderPolicy: () => import('App/Policies/TenderPolicy'),
  TenderFilePolicy: () => import('App/Policies/TenderFilePolicy'),
  OrganizationPolicy: () => import('App/Policies/OrganizationPolicy'),
  OrganizationMembershipPolicy: () => import('App/Policies/OrganizationMembershipPolicy'),
  OrganizationFilePolicy: () => import('App/Policies/OrganizationFilePolicy'),
  OrganizationContactPolicy: () => import('App/Policies/OrganizationContactPolicy'),
  OrganizationExperiencePolicy: () => import('App/Policies/OrganizationExperiencePolicy'),
  OrganizationCertificatePolicy: () => import('App/Policies/OrganizationCertificatePolicy'),
  OrganizationCertificateFilePolicy: () => import('App/Policies/OrganizationCertificateFilePolicy'),
})
