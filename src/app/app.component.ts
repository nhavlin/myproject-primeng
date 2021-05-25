import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data$: Observable<TreeNode[]>;
  dataSearch$: Observable<TreeNode[]>;
  data1: TreeNode[];

  selectedNode: TreeNode;

  searchInput: FormControl = new FormControl('');
  searchInput$ :Observable<string> = this.searchInput.valueChanges.pipe(
      startWith(''), // start it off
      debounceTime(300), // debounce the user input
      distinctUntilChanged()
       )

       result$:Observable<TreeNode[]>

  constructor(
    private messageService: MessageService,
    private http: HttpService
  ) {}

  ngOnInit() {
    this.dataSearch$ = this.http.getData().pipe(
      // map( (data):string[] =>
      //   data.map(entity => entity.children.map(child => child.label)).flat()
      // ),
      tap(console.log)
    );

    this.result$ =combineLatest([this.searchInput$,this.dataSearch$]).pipe(
    map(([search,data])=>{
      if(search){

     return   data[0].children.filter(single=>single.label.includes(search))
      }
      else{
        return data
      }
     // data.map(entity => entity.children.map(child => child.label))
    })

    )




    this.data$ = this.http.getData().pipe(tap(data => (this.data1 = data)));
  }
  // showData() {
  //   this.http
  //     .getData()
  //     .pipe()
  //     // clone the data object, using its known Config shape
  //     .subscribe((data: IData) => {
  //       this.data1 = { ...data };
  //       console.log(this.data1);
  //     });
  // }
  onNodeSelect(event) {
    this.messageService.add({
      severity: 'success',
      summary: 'Node Selected',
      detail: event.node.label
    });
  }
}
