import {
  Directive,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  HostBinding,
  HostListener
} from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { observable } from 'rxjs';

@Directive({
  selector: '[appPagination]',
  exportAs: "appPagination",
})
export class PaginationDirective implements OnInit, OnChanges {
  @Input() pageNo = 1;
  @Input() totalPages = 1;
  @Input() category: string;
  rows = 6;
  @Output() pageChange = new EventEmitter<number>();
  @Output() selectCategory = new EventEmitter<string>();
  @Output() desiredPriceRange = new EventEmitter<number>();
  @Output() lowestPricePoint: number;
  @Output() highestPricePoint: number;
  @Output() averagePricePoint: number;
  @Input() page = [];
  item: any;
  items = [];
  pageNum = 1;
  page_count: number;
  @Input() pagination7 = [];
  // page = [];
  @Input() currentPage = 1;
  serializedPageContents: string;
  products = [];
  productsByCategory: any;
  productsByPrice: any;


  constructor(
    private el: ElementRef, private renderer: Renderer2,
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
  ) { }
  ngOnInit() {
    if (window.localStorage.getItem("admin-order-killswitch") == 'false') {
      this.getProductsFromService();

      window.localStorage.setItem("admin-order-killswitch", 'true');
      
    }

    console.log("Test777", this.products);
    for (var i = 1; i < 23; i++) {
      this.item = "Item " + i;
      this.items.push(this.item);
      // console.log(this.items);
    }
    // In case no value is passed
    //if (this.products != null) {
    //  this.setValue(this.pageNo);
    //  this.SetupPagination(this.products, this.rows);
    //  console.log(this.pagination7);
    //}
    //else {
    //  console.log("product is null failure");
    //}

  }

  ngOnChanges({ pageNo, totalPages, category}: SimpleChanges) {
    // Needs to be checked before pageNo
    if (totalPages) {
      this.onTotalPagesInput();
    }

    if (pageNo) {
      this.onPageNoInput();
    }

    if (category) {
      this.categoryStringInput();
    }

  }

  @HostListener("input", ["$event.target.value"]) onInput(val) {
    this.setValue(this.getParsedValue(val));
    console.log("ABCKFCCategoryNGonChange******", this.el.nativeElement.value);
  }

  @HostListener("change", ["$event.target.value"]) onChange(val) {
    if (val === "") {
      this.setValue(1);
    }

    if (this.isOutOfRange(val)) {
      this.setValue(this.totalPages);
    }

    this.pageNo = Number(this.el.nativeElement.value);
    this.pageChange.emit(this.pageNo);
  }

  get isFirst(): boolean {
    return this.pageNo === 1;
  }

  get isLast(): boolean {
    return this.pageNo === this.totalPages;
  }

  first() {
    this.setPage(1);
  }

  prev() {
    this.setPage(Math.max(1, this.pageNo - 1));
  }

  next() {
    this.setPage(Math.min(this.totalPages, this.pageNo + 1));
  }

  last() {
    this.setPage(this.totalPages);
  }

  private setValue(val: string | number) {
    this.renderer.setProperty(this.el.nativeElement, "value", String(val));
  }

  private setPage(val: number) {
    this.pageNo = val;
    this.setValue(this.pageNo);
    this.pageChange.emit(this.pageNo);
  }

  private getParsedValue(val: string): string {
    return val.replace(/(^0)|([^0-9]+$)/, "");
  }

  private SetupPagination(items, rows_per_page) {
    this.pagination7 = [];
    
    let page_count = Math.ceil(items.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
      this.DisplayList(items, rows_per_page, i);
      //this.serializedPageContents = JSON.stringify(this.page);

      this.pagination7.push(this.page);
      console.log(i, this.page);
      this.page = [];
    }
    window.localStorage.setItem("pageCount", this.pagination7.length.toString());
    console.log("$$$$$$$$$$pageCount$$$$$$$$$$$", window.localStorage.getItem("pageCount"));
    // 	// let btn = PaginationButton(i, items);
    // 	// wrapper.appendChild(btn);
    //   console.log("test");
  }

  private isOutOfRange(val: string): boolean {
    return Number(val) > this.totalPages;
  }

  private onTotalPagesInput() {
    if (typeof this.totalPages !== "number") {
      this.totalPages = 1;
    }
  }

  private onPageNoInput() {
    if (
      typeof this.pageNo !== "number" ||
      this.pageNo < 1 ||
      this.pageNo > this.totalPages
    ) {
      this.pageNo = 1;
    }

    this.setValue(this.pageNo);
  }

  private categoryStringInput() {
    this.setValue(this.category);
    console.log("******Change******", this.category);
  }
  private DisplayList(items, rows_per_page, page) {
    page--;
    let start = rows_per_page * page;
    let end = start + rows_per_page;

    let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {
      let item = paginatedItems[i];

      this.page.push(item);
      // item_element.innerText = item;

      // wrapper.appendChild(item_element);


    }
  }

  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      console.log("*******&&&&&&&&ObservableTEst********");
      this.products = data['Products'];
      //this.totalRecords = data['Products'].length;
      console.log("Got our products from service!", this.products);
      this.SetupPagination(this.products, this.rows);
      window.localStorage.setItem("pagination", JSON.stringify(this.pagination7));

      location.reload();

      //console.log("pagination7", JSON.parse(window.localStorage.getItem("pagination")));


    })
  }

  viewProductsByCategory() {
    let obervable = this._httpService.getProductByCategory(this.category);
    obervable.subscribe(data => {
      if (data['errors'] == null) {
        this.productsByCategory = data['Products'];
        console.log("******ProductsBYCategory", data['Products']);
        this.SetupPagination(this.productsByCategory, this.rows);
        window.localStorage.setItem("pagination", JSON.stringify(this.pagination7));

        location.reload();

      }
      else {
        console.log("Error", data['error']);
      }
      
    })
  }

  

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
  
  @HostListener('click', ['$event.target.value']) onClick(value: string) {

    //this.getProductsFromService();

    //var maxValue = parseFloat(window.localStorage.getItem("highestPricePoint"));
    //var minValue = parseFloat(window.localStorage.getItem("lowestPricePoint"));
    //var average = parseFloat(window.localStorage.getItem("averagePricePoint"));
    //console.log("Highest willing to pay ", maxValue, typeof (maxValue));
    //console.log("Lowest willing to pay ", minValue, typeof (minValue));
    //console.log("average ", average, typeof (average));
    //this.viewProductsByPrice(maxValue, minValue);

    this.category = this.el.nativeElement.value;
    console.log(this.highestPricePoint);
    this.selectCategory.emit(this.category);
    console.log("CategoryNGonChange******", this.category);
    this.viewProductsByCategory();
    
  }

  viewProductsByPrice(maxValue: number, minValue: number) {
    let observable = this._httpService.getProductsByPrice(maxValue, minValue);
    observable.subscribe(data => {
      this.productsByPrice = data['Products'];
      console.log("******Products by Price*******", this.productsByPrice);
      this.SetupPagination(this.productsByPrice, this.rows);
      window.localStorage.setItem("pagination", JSON.stringify(this.pagination7));

      //location.reload();

    });
  }
}