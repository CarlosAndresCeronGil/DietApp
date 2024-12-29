import { AfterViewInit, Component, computed, DestroyRef, ElementRef, EventEmitter, Input, input, model, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FoodData, FoodItem, FoodResponse } from '../../../models/food-data.interface';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shared-table',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss'
})
export class SharedTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator, { read: true }) paginator!: MatPaginator;
  readonly inputSearchBox = viewChild.required<ElementRef>('inputSearchBox');
  element_data = input.required<FoodResponse>();
  foodItemsList = input.required<FoodItem[]>();
  isLoadinFoodgData = input.required<boolean>();
  @Output() updateNameFiltered = new EventEmitter<any>();
  @Output() updateTable = new EventEmitter<any>();
  @Output() handleAddFood = new EventEmitter<FoodItem>();

  displayedColumns: string[] = ['name', 'protein', 'carbs', 'fat', 'quantity', 'unit', 'action'];
  dataSource!: MatTableDataSource<FoodItem, MatPaginator>;

  totalItems = computed(() => this.element_data().data.pagination.total);

  items_on_table = computed(() => this.element_data().data.items);

  constructor(
    private _destroyRef: DestroyRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['element_data']) {
      this.dataSource = new MatTableDataSource<FoodItem>(this.element_data().data.items);
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<FoodItem>(this.element_data().data.items);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    fromEvent(this.inputSearchBox().nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: (event: any) => {
          this.applyFilter(event);
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.updateNameFiltered.emit(filterValue);
  }

  paginatorChange(e: PageEvent) {
    this.updateTable.emit({per_page: e.pageSize, page: e.pageIndex + 1});
  }

  handleAddFoodItem(item: FoodItem) {
    this.handleAddFood.emit(item);
  }

  isItemAdded(item: FoodItem): boolean {
    return this.foodItemsList().some((foodItem) => foodItem.id === item.id);
  }

}
