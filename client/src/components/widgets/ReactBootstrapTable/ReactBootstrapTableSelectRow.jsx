import React, { useEffect } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from 'react-bootstrap-table2-editor';

const pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: true,
    showTotal: true,
    withFirstAndLast: false,
    sizePerPage : 50,
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
        <div className="dataTables_length" id="datatable-basic_length">
            <label>
                Show{" "}
                {
                    <select
                        name="datatable-basic_length"
                        aria-controls="datatable-basic"
                        className="form-control form-control-sm"
                        onChange={e => onSizePerPageChange(e.target.value)}
                    >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                    </select>
                }{" "}
                entries.
        </label>
        </div>
    )
});

const { SearchBar } = Search;


function ReactBootstrapTableSelectRow(props) {

    useEffect(() => {
        document.getElementsByTagName('table')[0].classList.add('align-items-center')
        return () => {
            document.getElementsByTagName('table')[0].classList.remove('align-items-center')
        }
    })

    const defaultSorted = [{
        dataField: props.dataField ? props.dataField : "_id",
        order: props.order ? props.order : "asc"
    }];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        onSelect: props.handleOnSelect,
        onSelectAll : props.handleOnSelectAll,
        
      };

    return (
        <>
            <ToolkitProvider
                data={props.data}
                keyField="_id"
                columns={props.columns}
                search
            >
                {m_props => (
                    <div className={`py-4 ${props.isResponsive ? 'table-responsive' : ""}`}>
                        <div className="row">
                            <div className="col-auto">
                                <div id="datatable-basic_filter" className="dataTables_filter px-4 pb-1">
                                    <label>
                                        Search:
                                            <SearchBar
                                            className="form-control-sm"
                                            placeholder=""
                                            {...m_props.searchProps}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="col">
                                {
                                    props.children
                                }
                            </div>
                        </div>
                        {
                            <BootstrapTable
                                {...m_props.baseProps}
                                bootstrap4={true}
                                pagination={pagination}
                                defaultSorted={defaultSorted}
                                expandRow={props.expandRow ? props.expandRow : false}
                                selectRow={selectRow}
                                cellEdit={ cellEditFactory({ mode: props.isCellEdit ? 'click' : '' }) }
                                bordered={false} />
                        }


                    </div>
                )}
            </ToolkitProvider>
        </>
    )
}

export default ReactBootstrapTableSelectRow