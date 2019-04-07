import React from 'react';
import Base from '../components/base';
import api from '../services/api';
import ItemHeader from '../components/itemHeader';
import Field from '../components/field';
import Loading from '../components/loading';
import MetadataFields from '../components/metadataFields';
import {TableBody} from '../components/listViewHelpers';
import SaveButton from '../components/saveButton';
import DeleteButton from '../components/deleteButton';
import ResourceSvg from '../art/resourceSvg';
import Sorter, {defaultSortInfo} from '../components/sorter';

const service = api.clusterRoleBinding;

export default class ClusterRoleBinding extends Base {
    state = {
        sort: defaultSortInfo(this, 'name'),
    };

    componentDidMount() {
        const {name} = this.props;

        this.registerApi({
            item: service.get(name, item => this.setState({item})),
        });
    }

    render() {
        const {name} = this.props;
        const {item, sort} = this.state;
        const subjects = item && item.subjects;

        return (
            <div id='content'>
                <ItemHeader title={['Cluster Role Binding', name]} item={item}>
                    <>
                        <SaveButton
                            item={item}
                            onSave={x => service.put(x)}
                        />

                        <DeleteButton
                            onDelete={() => service.delete(name)}
                        />
                    </>
                </ItemHeader>

                <div className='contentPanel'>
                    {!item ? <Loading /> : (
                        <>
                            <div>
                                <MetadataFields item={item} />
                            </div>
                            <Field name='Role'>
                                <a href={getRoleHref(item.roleRef)}>
                                    {item.roleRef.name}
                                </a>
                            </Field>
                        </>
                    )}
                </div>

                <div className='contentPanel'>
                    <table>
                        <thead>
                            <tr>
                                <th className='th_icon'>
                                    <Sorter sort={sort} field='kind'>Type</Sorter>
                                </th>
                                <th>
                                    <Sorter sort={sort} field='name'>Name</Sorter>
                                </th>
                                <th>
                                    <Sorter sort={sort} field='namespace'>Namespace</Sorter>
                                </th>
                                <th>
                                    <Sorter sort={sort} field='apiGroup'>Api Group</Sorter>
                                </th>
                            </tr>
                        </thead>

                        <TableBody items={subjects} colSpan='4' sort={sort} row={x => (
                            <tr key={x.name}>
                                <td>
                                    <ResourceSvg resource={x.kind} />
                                    <div className='td_iconLabel'>{x.kind}</div>
                                </td>
                                <td>
                                    {x.kind === 'ServiceAccount' ? (<a href={getSubjectHref(x)}>{x.name}</a>) : x.name}
                                </td>
                                <td>{x.namespace}</td>
                                <td>{x.apiGroup}</td>
                            </tr>
                        )} />
                    </table>
                </div>
            </div>
        );
    }
}

function getRoleHref({name, kind, namespace}) {
    return kind === 'ClusterRole' ? `#!clusterrole/${name}` : `#!role/${namespace}/${name}`;
}

function getSubjectHref({name, namespace}) {
    return namespace ? `#!serviceaccount/${namespace}/${name}` : `#!serviceaccount/${name}`;
}
