import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../globals";
import { ItemService } from "../provider/item.service";
import { Item, outputItem } from "./item";

@Component({
  selector: "optimized",
  template: `
  
<!--
  <h4>Optimized To-Do List</h4>

  <div id="todo-list-wrapper">

  <ul *ngIf="optList.length>0">
    <li>
      <div class="item-amount">Task</div>
      <div class="item-amount">Psuedo Reward</div>
      <div class="item-amount">Estimated Time</div>
    </li>
    <p>ng For: item of optList</p>
    <li *ngFor="let item of optList" (click)="toggleOpacity($event)">
  <div class="item-amount">{{getHumanReadable(item.nm)}}</div>
  <div class="item-amount">{{item.val}}</div>
  <div class="item-amount">{{getTime(item.nm)}}</div>
  </li>
  </ul>
-->

  <div id="todo-list-wrapper">
  <h2> Final List </h2>
  <p id="finallist>text</p>

  <h2>Your most important goal is</h2>
  <p id="most_important_goal" style="color:blue; font-size: 18px; white-space:pre-wrap;">placeholder for the most important goal</p>
  <br><br>

  <h2>Your second most important goal is</h2>
  <p id="2nd_important_goal" style="color:blue; font-size: 18px; white-space:pre-wrap;">placeholder for the second most important goal</p>

  <br><br>
  <h3>Your other goals are:</h3>
  <div>
  <li *ngFor="let item of final_optList.slice(2)"></li>
  </div>

  <br><br>
  <p>
  Here is the passcode you need to proceed on GuidedTrack survey: <b>goal100</b><br>
  Please DO NOT close this window yet because you will need the information on this screen to answer some questions. 
  </p>
</div>


  `,
  styles: [
    `
    #todo-list-wrapper {
      margin-bottom: 100px;
    }
    
    #todo-list-wrapper ul {
    }
  
    #todo-list-wrapper ul li {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      box-sizing:border-box;
      padding: 2.5%;
      text-align:center;
      cursor:pointer;
      border-bottom: 1px solid #777;
    }
    #todo-list-wrapper ul li:last-child {
      cursor:default;
      border: none;
    }
    #todo-list-wrapper ul li:first-child {
      cursor:default;
      font-size: 1.2rem;
    }

    #todo-list-wrapper ul li div {
      width: 20%;
      text-align:left;
    }

    #todo-list-wrapper ul li img {
      width: 100%;
    }

    #todo-list-wrapper ul li .item-bar {
  
      display: flex;
      justify-content:center;
      width: 90%;
      height: 50px;
      line-height: 50px;
    }

    #todo-list-wrapper ul li .item-bar div {

    }



  
    `,
  ],
})
export class OptimizedListComponent implements OnInit {
  public optList: outputItem[]
  public re: RegExp
  public goalname_map: {}
  public goal_map: {}
  public finalList = [];
  public final_optList = [];
  public project_list = [];


  constructor(public router: Router, private activatedRoute: ActivatedRoute, public itemService: ItemService) {
    this.optList = Globals.optTaskList;
    this.re = /[\s]?[(]takes about[\s]?[0-9]+[\s]?[a-z]*[\s]?[a-z]*[\s]?[0-9]*[\s]?[a-z]*[)]/;

    console.log('In optimized page constructor');
    console.log(this.optList);
    // console.log("length");
    // console.log(this.optList.length>0);
  }

  ngOnInit() {
    console.log("In Running Algo");
    this.optList = this.activatedRoute.snapshot.data['optList'];
    Globals.optTaskList = this.optList;
    console.log('API finished. In optimed page');
    console.log(this.optList);

    this.goalname_map = this.itemService.goalname_map
    console.log("goalname_map: ", this.goalname_map)
    this.goal_map = this.itemService.goal_map;
    console.log("goal_map: ", this.goal_map)
    this.project_list = this.itemService.project_list;
    console.log("project list: ", this.project_list)


    //check optList, remove duplicated goals {g2, g1, g1, g2, g1} -> {g2, g1}

    console.log("1 final List: ", this.finalList);
    for (let i = 0; i < this.optList.length; i++) {
      var temp = this.optList[i]["id"].slice(0, 2);
      if (!this.finalList.includes(temp)) {
        this.finalList.push(temp);
      }
      console.log("final List: ", this.finalList); // in the suggested order for users to follow
    }
    this.getGoalname(this.finalList);
    
    // this.itemService.getOptimalList().subscribe((optList)=> {
    //   console.log("RUNNING");
    //   Globals.optTaskList = optList;
    //   console.log(optList);
    // })

  }

  toggleOpacity(e) {

    let ele = e.target.closest('li')

    if (ele.getAttribute('checked') == 'true') {

      ele.style.opacity = '1'

      ele.setAttribute('checked', 'false')
    }
    else {

      ele.style.opacity = '.3'

      ele.setAttribute('checked', 'true')
    }
  }

  titleCase(str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  getTagRegex(tag) {
    return tag.exec('(?:\b|)');
  }

  getHumanReadable(item_name) {
    item_name = this.re[Symbol.replace](item_name, "");
    let prefix = /[0-9]*[)]?[\s]?/;
    item_name = prefix[Symbol.replace](item_name, "");
    // console.log('After Regex Name Removing )');
    // console.log(item_name);
    return item_name;
  }

  getTime(item_name) {
    let time = this.re[Symbol.match](item_name).toString();
    let prefix = /[\s]?[(]takes about[\s]?/;
    time = prefix[Symbol.replace](time, "");
    let suffix = /[)]/;
    time = suffix[Symbol.replace](time, "");
    // console.log('After Regex Time');
    // console.log(time);
    return time
  }

  getGoalname(finalList) {
    //display a prioritized list
    console.log("finalList (in getGoalname): ", finalList);

    let final_optList = [];
    for (let i = 0; i < finalList.length; i++) {
      //final_optList.push(i+1 + " " +this.goalname_map[finalList[i].slice(1,) - 1]);
      this.goal_map[finalList[i].slice(1,)-1]=this.goal_map[finalList[i].slice(1,)-1].replace("Deadline: undefined", "");
      final_optList.push(i+1 + ". " +this.goal_map[finalList[i].slice(1,) - 1]);
    }
    console.log("goalname_map: ", this.goalname_map);
    console.log("goal_map ", this.goal_map);
    console.log("final opt List: ", final_optList);
    console.log("type: ",typeof(final_optList));
    let fianl_optList_br = final_optList.join('\r\n');
    console.log(fianl_optList_br)
    console.log(typeof(fianl_optList_br))


    //get children nodes in a list with the order of final list
    const top_priority_idx = this.project_list.findIndex(object => { return object.id === this.finalList[0] }) 
    const second_priority_idx = this.project_list.findIndex(object => { return object.id === this.finalList[1] }) 
    console.log("priority idx: ", top_priority_idx, second_priority_idx)
  
    console.log("get children list - children nodes only:")
    var ch_1 = this.project_list[top_priority_idx].ch
    var ch_2 = this.project_list[second_priority_idx].ch
    console.log("children nodes -- ")
    var ch_1list = []
    var ch_2list = []
    for (let i = 0; i < ch_1.length; i++){
       // console.log("object info of a child: ", ch_1[i].nm);
       // console.log("object info of a child without #today: ", ch_1[i].nm.substring(0, ch[i].nm.length-6));
        ch_1list.push(ch_1[i].nm);
    }
    for (let i = 0; i < ch_2.length; i++){
    //  console.log("object info of a child: ", ch_2[i].nm);
    //  console.log("object info of a child without #today: ", ch_2[i].nm.substring(0, ch[i].nm.length-6));
      ch_2list.push(ch_2[i].nm);
  }
    console.log("print temp_arr: ", ch_1list)
    console.log("print temp_arr: ", ch_2list)

    //after generating a list
    const most_important_goal = document.getElementById("most_important_goal");
    most_important_goal.innerText= this.final_optList[0] + ch_1list;
    
    const second_important_goal = document.getElementById("2nd_important_goal");
    second_important_goal.innerText = this.final_optList[1] + ch_2list;
    
    console.log("final optList", this.final_optList)

    const finallist_opt = document.getElementById("finallist");
    finallist_opt.innerText = fianl_optList_br;

    return fianl_optList_br;
  }

}
