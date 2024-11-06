import { MainController } from "./controller/MainController"

export const Routes = [
    // user rates expert
{
    method: "get",
    route: "/api/v1/comments-expert",
    controller: MainController,
    action: "userRatesExpertAll"
}, {
    method: "get",
    route: "/api/v1/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertOne"
}, {
    method: "post",
    route: "/api/v1/comments-expert",
    controller: MainController,
    action: "userRatesExpertSave"
}, {
    method: "patch",
    route: "/api/v1/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertUpdate"
}, {
    method: "delete",
    route: "/api/v1/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertRemove"
}, 
    // user rates store
{
    method: "get",
    route: "/api/v1/comments-store",
    controller: MainController,
    action: "userRatesStoreAll"
}, {
    method: "get",
    route: "/api/v1/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreOne"
}, {
    method: "post",
    route: "/api/v1/comments-store",
    controller: MainController,
    action: "userRatesStoreSave"
}, {
    method: "patch",
    route: "/api/v1/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreUpdate"
}, {
    method: "delete",
    route: "/api/v1/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreRemove"
// food comments
}, {
    method: "get",
    route: "/api/v1/comments-food",
    controller: MainController,
    action: "userCommentsFoodAll"
}, {
    method: "get",
    route: "/api/v1/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodOne"
}, {
    method: "post",
    route: "/api/v1/comments-food",
    controller: MainController,
    action: "userCommentsFoodSave"
}, {
    method: "patch",
    route: "/api/v1/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodUpdate"
}, {
    method: "delete",
    route: "/api/v1/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodRemove"
}]